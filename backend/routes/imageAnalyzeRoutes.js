const express = require('express');
const router = express.Router();
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

/**
 * Image Disease Analysis Route
 * Uses Gemini multimodal to identify diseases from uploaded images.
 * Supports: skin conditions, eye diseases, wound/injury assessment,
 * medical reports, X-rays, prescriptions, and general health images.
 */

// Lazy-initialize the multimodal LLM
let multimodalLLM = null;

function getMultimodalLLM() {
  if (!multimodalLLM) {
    multimodalLLM = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash',
      maxOutputTokens: 3000,
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.3, // Lower temp for more factual medical analysis
    });
  }
  return multimodalLLM;
}

/**
 * POST /api/image-analyze
 * Body: { image: "<base64 data URL>", context: "<optional user note>" }
 * Returns structured disease analysis JSON
 */
router.post('/', async (req, res) => {
  const { image, context } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'No image provided. Please attach an image for analysis.' });
  }

  if (!process.env.GOOGLE_API_KEY) {
    return res.status(503).json({ error: 'AI image analysis is not configured. GOOGLE_API_KEY is missing.' });
  }

  console.log('🔬 Image disease analysis initiated...');

  // Parse base64 image
  let cleanBase64 = image;
  let mimeType = 'image/jpeg';

  const mimeMatch = image.match(/^data:([^;]+);base64,/);
  if (mimeMatch) {
    mimeType = mimeMatch[1];
    cleanBase64 = image.split(';base64,')[1];
  }

  if (!cleanBase64 || cleanBase64.length < 100) {
    return res.status(400).json({ error: 'Invalid image data. Please provide a valid image.' });
  }

  const systemPrompt = `You are Ayurva's medical image analysis engine — a highly specialized AI assistant trained to identify diseases, conditions, and abnormalities from medical and health-related images.

You can analyze:
- Skin conditions: rashes, eczema, psoriasis, acne, fungal infections, melanoma, hives, vitiligo, ringworm, scabies
- Eye conditions: conjunctivitis, cataract, glaucoma, stye, jaundice (yellowing), pink eye
- Wound and injury assessment: cuts, burns, bruises, infections, inflammation
- Oral health: ulcers, gum disease, oral thrush, tooth decay signs
- Nail conditions: fungal nail, discoloration
- X-rays and medical scans: fractures, abnormalities (if identifiable)
- Medical reports and prescriptions: summarize key findings
- General body symptoms visible in images

RESPONSE FORMAT — You MUST respond with a valid JSON object in EXACTLY this structure:
{
  "identified": true | false,
  "primaryCondition": "Most likely condition name",
  "confidence": "High | Moderate | Low",
  "category": "Skin | Eye | Wound | Oral | Nail | Scan | Report | General",
  "description": "2-3 sentences describing what you see in the image",
  "possibleConditions": [
    { "name": "Condition Name", "probability": "High/Moderate/Low", "description": "Brief description" }
  ],
  "symptoms": ["visible symptom 1", "visible symptom 2"],
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "urgency": "Emergency | Urgent | Soon | Routine | Informational",
  "specialistType": "Dermatologist | Ophthalmologist | General Physician | Orthopedic | etc.",
  "homeRemedies": ["remedy 1", "remedy 2"],
  "warningSigns": ["warning sign to watch for"],
  "disclaimer": "Standard medical disclaimer text"
}

RULES:
1. Always set identified=false if the image is unclear, not medical, or cannot be analyzed.
2. Be specific but conservative — if unsure, say "Moderate" or "Low" confidence.
3. NEVER prescribe specific drug dosages.
4. ALWAYS recommend professional consultation.
5. If it's an emergency (severe bleeding, possible cancer, severe burn), set urgency to "Emergency".
6. Respond ONLY with the JSON object — no extra text before or after.`;

  const userText = context
    ? `Please analyze this image for diseases or medical conditions. Additional context from the user: "${context}"`
    : 'Please analyze this image and identify any visible diseases, skin conditions, or medical abnormalities.';

  try {
    const llm = getMultimodalLLM();

    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage({
        content: [
          { type: 'text', text: userText },
          {
            type: 'image_url',
            image_url: `data:${mimeType};base64,${cleanBase64}`
          }
        ]
      })
    ]);

    const rawContent = response.content.trim();
    console.log('✅ Image analysis complete, parsing response...');

    // Extract JSON from the response (handle markdown code blocks if present)
    let jsonStr = rawContent;
    const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Try to parse as JSON
    let analysisResult;
    try {
      analysisResult = JSON.parse(jsonStr);
    } catch (parseErr) {
      console.warn('⚠️ Could not parse JSON, returning raw text analysis');
      // Fallback: return as plain text wrapped in a structure
      analysisResult = {
        identified: true,
        primaryCondition: 'See description',
        confidence: 'Moderate',
        category: 'General',
        description: rawContent,
        possibleConditions: [],
        symptoms: [],
        recommendedActions: ['Consult a doctor for proper diagnosis'],
        urgency: 'Soon',
        specialistType: 'General Physician',
        homeRemedies: [],
        warningSign: [],
        disclaimer: 'This is AI-generated analysis and cannot replace professional medical diagnosis. Always consult a qualified healthcare provider.'
      };
    }

    // Ensure disclaimer is always present
    if (!analysisResult.disclaimer) {
      analysisResult.disclaimer = 'This is AI-generated analysis and cannot replace professional medical diagnosis. Always consult a qualified healthcare provider.';
    }

    console.log(`✅ Disease identified: ${analysisResult.primaryCondition} (${analysisResult.confidence} confidence)`);

    return res.json({
      success: true,
      analysis: analysisResult,
      service: 'gemini-multimodal'
    });

  } catch (error) {
    console.error('❌ Image analysis error:', error.message);

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      return res.status(429).json({ error: 'AI service quota exceeded. Please try again later.' });
    }

    if (error.message?.includes('API_KEY') || error.message?.includes('401')) {
      return res.status(503).json({ error: 'AI service authentication failed. Please contact support.' });
    }

    return res.status(500).json({
      error: 'Failed to analyze image. Please try again or consult a doctor directly.',
      details: error.message
    });
  }
});

/**
 * GET /api/image-analyze/status
 * Returns the status of the image analysis service
 */
router.get('/status', (req, res) => {
  res.json({
    service: 'image-disease-analyzer',
    available: !!process.env.GOOGLE_API_KEY,
    model: 'gemini-2.5-flash',
    capabilities: [
      'Skin disease detection',
      'Eye condition analysis',
      'Wound assessment',
      'Oral health',
      'Nail conditions',
      'X-ray analysis',
      'Medical report summarization'
    ]
  });
});

module.exports = router;
