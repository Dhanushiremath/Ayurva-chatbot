# Ayurva AI Training & Enhancement Guide

## Current AI Capabilities

Your Ayurva chatbot now uses a **3-tier intelligence system**:

### Tier 1: Pattern-Based Intent Detection
- Automatically classifies questions based on patterns
- "What is..." → Disease queries
- "How to..." → General health advice
- "I have..." → Symptom reporting

### Tier 2: Local Knowledge Base
- **30+ health topics** with instant responses
- **Disease database** from medical_knowledge.json
- **Enhanced QA** from enhanced_qa.json
- Response caching for speed

### Tier 3: HuggingFace AI (Qwen Model)
- Handles complex questions not in knowledge base
- Free tier with 32B parameter model
- Fallback for unknown queries

---

## How to Train for More Complex Questions

### Option 1: Expand Local Knowledge Base (Recommended)

**Add to `backend/data/enhanced_qa.json`:**

```json
{
  "healthTopics": {
    "new_topic": "Your detailed answer here...",
    "another_topic": "Another answer..."
  }
}
```

**Benefits:**
- Instant responses (no API delay)
- No cost
- Full control over answers
- Works offline

### Option 2: Upgrade HuggingFace Model

**Current:** Free Qwen/Qwen2.5-Coder-32B-Instruct

**Upgrade Options:**
1. **HuggingFace PRO** ($9/month)
   - Access to larger models (70B+)
   - Faster response times
   - More complex reasoning

2. **Switch to OpenAI GPT**
   - Better medical knowledge
   - More natural responses
   - Cost: ~$0.002 per request

3. **Use Anthropic Claude**
   - Excellent for medical queries
   - Very accurate
   - Cost: ~$0.003 per request

### Option 3: Train Custom Model

**For production-grade chatbot:**

1. **Collect Training Data**
   - Real user conversations
   - Medical Q&A pairs
   - Symptom-diagnosis examples

2. **Fine-tune Model**
   - Use HuggingFace fine-tuning
   - Or Google's Med-PaLM
   - Or BioGPT for medical domain

3. **Deploy Custom Model**
   - Host on HuggingFace Inference
   - Or AWS SageMaker
   - Or Google Vertex AI

---

## Adding New Health Topics

### Step 1: Update enhanced_qa.json

```json
{
  "healthTopics": {
    "asthma": "Asthma is managed by avoiding triggers, using prescribed inhalers, monitoring symptoms, staying active with doctor approval, and having an action plan. Keep rescue inhaler handy always.",
    "allergies": "Manage allergies by identifying triggers, using antihistamines, keeping windows closed during high pollen days, washing hands frequently, and consulting an allergist for severe cases."
  }
}
```

### Step 2: Add Training Examples (Optional)

In `backend/services/nlp-service.js`, add to `trainClassifier()`:

```javascript
this.classifier.addDocument('tell me about asthma', 'disease_query');
this.classifier.addDocument('how to manage allergies', 'general_qa');
```

### Step 3: Restart Backend

```bash
cd backend
npm start
```

---

## Handling Complex Medical Questions

### Current Approach:
1. Check local knowledge base first
2. If not found, call HuggingFace AI
3. Cache response for future use

### To Improve:
1. **Add Medical Context**
   - Update AI prompt with medical guidelines
   - Include disclaimers
   - Add emergency warnings

2. **Implement RAG (Retrieval Augmented Generation)**
   - Store medical documents in vector database
   - Retrieve relevant info before AI call
   - Combine retrieved info with AI response

3. **Add Fact-Checking**
   - Verify AI responses against medical databases
   - Flag uncertain responses
   - Suggest consulting doctor for serious symptoms

---

## Recommended Enhancements

### 1. Add More Diseases to Knowledge Base

Edit `backend/data/medical_knowledge.json`:

```json
{
  "diseases": [
    {
      "name": "Asthma",
      "symptoms": ["shortness of breath", "wheezing", "chest tightness", "coughing"],
      "prevention": "Avoid triggers like smoke, dust, pollen. Use prescribed inhalers regularly.",
      "treatment": "Use rescue inhaler during attacks. Take controller medications daily. Monitor peak flow.",
      "critical_signs": "Severe breathing difficulty, blue lips, inability to speak full sentences"
    }
  ]
}
```

### 2. Implement Conversation Memory

Store user's medical history in MongoDB:
- Previous symptoms
- Chronic conditions
- Medications
- Allergies

### 3. Add Multilingual AI Support

Currently supports 7 languages in UI, but AI responds in English only.

**To add:**
- Detect user's language
- Translate query to English
- Get AI response
- Translate back to user's language

### 4. Integrate Medical APIs

- **Drugs.com API** - Medication information
- **OpenFDA API** - Drug interactions
- **PubMed API** - Research articles
- **ICD-10 API** - Disease codes

---

## Testing Your Enhancements

### Test Script:

```javascript
// backend/test-enhanced-ai.js
const nlp = require('./services/nlp-service');

async function test() {
  const queries = [
    'What is asthma?',
    'How to manage diabetes?',
    'Tips for heart health',
    'I have chest pain and shortness of breath'
  ];
  
  for (const q of queries) {
    const result = await nlp.processMessage(q, 'test_user');
    console.log(`Q: ${q}`);
    console.log(`A: ${result.response}\n`);
  }
}

test();
```

Run: `node backend/test-enhanced-ai.js`

---

## Performance Optimization

### Current Performance:
- Local knowledge: <50ms
- HuggingFace AI: 2-5 seconds
- Cached responses: <10ms

### To Improve:
1. **Increase cache size** (currently 100 entries)
2. **Pre-load common questions** at startup
3. **Use faster AI model** (smaller but quicker)
4. **Implement request queuing** for multiple users

---

## Next Steps

1. ✅ Pattern-based intent detection (Done)
2. ✅ Enhanced knowledge base (Done)
3. ✅ HuggingFace AI integration (Done)
4. ⏳ Add 50+ more health topics
5. ⏳ Implement conversation memory
6. ⏳ Add medical API integrations
7. ⏳ Fine-tune custom model
8. ⏳ Add multilingual AI responses

---

## Resources

- **HuggingFace Models**: https://huggingface.co/models
- **Medical Datasets**: https://www.kaggle.com/datasets?search=medical
- **OpenAI API**: https://platform.openai.com/docs
- **Anthropic Claude**: https://www.anthropic.com/api
- **Med-PaLM**: https://sites.research.google/med-palm/

Your Ayurva chatbot is now ready to handle complex questions!
