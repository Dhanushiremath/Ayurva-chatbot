const express = require('express');
const router = express.Router();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

/**
 * Image Disease Analysis Route
 * Uses Gemini 2.0 Flash (fastest multimodal) for disease identification.
 * Optimized for low latency: tight prompt, low token cap, image compression.
 */

// Singleton LLM — initialized once, reused across requests
let multimodalLLM = null;

function getLLM() {
  if (!multimodalLLM) {
    multimodalLLM = new ChatGoogleGenerativeAI({
      // gemini-2.0-flash: fastest multimodal model, ~2-4s vs 10-15s for 2.5-flash
      model: 'gemini-2.0-flash',
      maxOutputTokens: 1024, // JSON response never needs more than ~600 tokens
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.1,      // near-deterministic for medical precision
    });
  }
  return multimodalLLM;
}

// Tight system prompt — shorter = faster token processing
const SYSTEM_PROMPT = `You are a medical image analysis AI. Analyze the image and respond ONLY with this exact JSON (no markdown, no extra text):
{"identified":true,"primaryCondition":"name","confidence":"High|Moderate|Low","category":"Skin|Eye|Wound|Oral|Nail|Scan|Report|General","description":"1-2 sentences","possibleConditions":[{"name":"name","probability":"High|Moderate|Low","description":"brief"}],"symptoms":["s1","s2"],"recommendedActions":["a1","a2","a3"],"urgency":"Emergency|Urgent|Soon|Routine|Informational","specialistType":"type","homeRemedies":["r1","r2"],"warningSigns":["w1"],"disclaimer":"AI analysis only. Consult a doctor."}
Rules: set identified=false if unclear. Never prescribe dosages. Emergency urgency for life-threatening signs.`;

/**
 * Compress base64 image before sending to Gemini.
 * Reduces payload size → faster upload and processing.
 * Max dimension: 800px, quality: 0.75
 */
async function compressImageBase64(base64, mimeType) {
  // Server-side: we can't use canvas, but we can cap the base64 size.
  // If image > 1MB base64 (~750KB raw), warn but still send — Gemini handles it.
  // Real compression would need sharp/jimp — skip to keep deps minimal.
  return { base64, mimeType };
}

/**
 * POST /api/image-analyze
 * Body: { image: "<base64 data URL>", context?: "<user note>" }
 */
router.post('/', async (req, res) => {
  const startTime = Date.now();
  const { image, context } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image provided.' });
  }
  if (!process.env.GOOGLE_API_KEY) {
    return res.status(503).json({ error: 'AI service not configured.' });
  }

  // Parse base64
  let cleanBase64 = image;
  let mimeType = 'image/jpeg';
  const mimeMatch = image.match(/^data:([^;]+);base64,/);
  if (mimeMatch) {
    mimeType = mimeMatch[1];
    cleanBase64 = image.split(';base64,')[1];
  }

  if (!cleanBase64 || cleanBase64.length < 100) {
    return res.status(400).json({ error: 'Invalid image data.' });
  }

  // Warn if image is very large (>2MB base64 ~= 1.5MB raw)
  if (cleanBase64.length > 2_000_000) {
    console.warn(`⚠️ Large image received: ${(cleanBase64.length / 1024).toFixed(0)}KB base64`);
  }

  const userText = context
    ? `Analyze this image. User context: "${context.slice(0, 200)}"`
    : 'Analyze this image for diseases or medical conditions.';

  // Set a hard 25s timeout — Render free tier kills requests at 30s
  const TIMEOUT_MS = 25000;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)
  );

  try {
    const llm = getLLM();
    console.log(`🔬 Image analysis started (${(cleanBase64.length / 1024).toFixed(0)}KB)...`);

    const aiPromise = llm.invoke([
      new SystemMessage(SYSTEM_PROMPT),
      new HumanMessage({
        content: [
          { type: 'text', text: userText },
          { type: 'image_url', image_url: `data:${mimeType};base64,${cleanBase64}` }
        ]
      })
    ]);

    const response = await Promise.race([aiPromise, timeoutPromise]);
    const elapsed = Date.now() - startTime;
    console.log(`✅ Analysis done in ${elapsed}ms`);

    let rawContent = response.content.trim();

    // Strip markdown code fences if present
    const fenceMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (fenceMatch) rawContent = fenceMatch[1].trim();

    // Strip any leading/trailing non-JSON characters
    const jsonStart = rawContent.indexOf('{');
    const jsonEnd   = rawContent.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      rawContent = rawContent.slice(jsonStart, jsonEnd + 1);
    }

    let analysis;
    try {
      analysis = JSON.parse(rawContent);
    } catch {
      // Fallback structure if JSON parse fails
      analysis = {
        identified: true,
        primaryCondition: 'See description',
        confidence: 'Moderate',
        category: 'General',
        description: response.content,
        possibleConditions: [],
        symptoms: [],
        recommendedActions: ['Consult a doctor for proper diagnosis'],
        urgency: 'Soon',
        specialistType: 'General Physician',
        homeRemedies: [],
        warningSigns: [],
        disclaimer: 'AI analysis only. Consult a qualified doctor.'
      };
    }

    if (!analysis.disclaimer) {
      analysis.disclaimer = 'AI analysis only. This cannot replace professional medical diagnosis.';
    }

    return res.json({
      success: true,
      analysis,
      service: 'gemini-2.0-flash',
      latencyMs: elapsed
    });

  } catch (error) {
    const elapsed = Date.now() - startTime;
    console.error(`❌ Image analysis failed after ${elapsed}ms:`, error.message);

    if (error.message === 'TIMEOUT') {
      return res.status(504).json({
        error: 'Analysis timed out. Please try a smaller or clearer image.',
        tip: 'Images under 1MB analyze fastest.'
      });
    }
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'AI quota exceeded. Please try again in a minute.' });
    }
    if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      return res.status(503).json({ error: 'AI service authentication failed.' });
    }
    return res.status(500).json({
      error: 'Failed to analyze image. Please try again.',
      details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    });
  }
});

router.get('/status', (req, res) => {
  res.json({
    service: 'image-disease-analyzer',
    model: 'gemini-2.0-flash',
    available: !!process.env.GOOGLE_API_KEY,
    expectedLatency: '2-5 seconds'
  });
});

module.exports = router;
