const natural = require('natural');
const fs = require('fs');
const path = require('path');

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();

// Response cache
const responseCache = new Map();

// Load medical knowledge
let medicalKnowledge = {};
let enhancedQA = { health_topics: [] };

try {
  const medicalPath = path.join(__dirname, '../data/medical_knowledge.json');
  medicalKnowledge = JSON.parse(fs.readFileSync(medicalPath, 'utf8'));
} catch (error) {
  console.error('Error loading medical knowledge:', error.message);
}

try {
  const qaPath = path.join(__dirname, '../data/enhanced_qa.json');
  enhancedQA = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
} catch (error) {
  console.error('Error loading enhanced QA:', error.message);
}

// Symptom keywords
const symptomKeywords = {
  'fever': ['fever', 'temperature', 'hot'],
  'headache': ['headache', 'head pain', 'migraine'],
  'cough': ['cough', 'coughing'],
  'sore_throat': ['sore throat', 'throat pain'],
  'stomach_pain': ['stomach pain', 'stomach ache', 'belly pain'],
  'diarrhea': ['diarrhea', 'loose motion'],
  'nausea': ['nausea', 'feel sick'],
  'fatigue': ['tired', 'fatigue', 'exhausted'],
  'chest_pain': ['chest pain'],
  'shortness_of_breath': ['breathless', 'cant breathe'],
  'dizziness': ['dizzy', 'lightheaded'],
  'back_pain': ['back pain', 'backache'],
  'joint_pain': ['joint pain', 'knee pain'],
  'skin_rash': ['rash', 'itchy skin'],
  'insomnia': ['cant sleep', 'insomnia']
};

module.exports = {
  processMessage: async function(message, userId = null) {
    try {
      const cacheKey = message.toLowerCase().trim();
      if (responseCache.has(cacheKey)) {
        return responseCache.get(cacheKey);
      }
      
      const lowerMessage = message.toLowerCase();
      let response = '';
      
      // Greeting
      if (/^(hi|hello|hey|namaste)/i.test(lowerMessage)) {
        response = "Hello! I'm Ayurva, your health assistant. How can I help you today?";
        responseCache.set(cacheKey, response);
        return response;
      }
      
      // Emergency
      if (/(emergency|urgent|cant breathe|chest pain)/i.test(lowerMessage)) {
        response = "⚠️ EMERGENCY: If you're experiencing a medical emergency, call 108 (India) or 911 (US) immediately!";
        return response;
      }
      
      // Extract symptoms
      const symptoms = [];
      for (const [symptom, keywords] of Object.entries(symptomKeywords)) {
        if (keywords.some(kw => lowerMessage.includes(kw))) {
          symptoms.push(symptom);
        }
      }
      
      // Get symptom info
      if (symptoms.length > 0 && medicalKnowledge.symptoms) {
        const symptomData = symptoms.map(s => medicalKnowledge.symptoms[s]).filter(Boolean);
        if (symptomData.length > 0) {
          const data = symptomData[0];
          response = `I understand you're experiencing ${symptoms[0].replace(/_/g, ' ')}.\n\n`;
          response += `Common causes: ${data.common_causes.join(', ')}.\n\n`;
          response += `Advice: ${data.advice}`;
          responseCache.set(cacheKey, response);
          return response;
        }
      }
      
      // Search enhanced QA
      if (enhancedQA && enhancedQA.health_topics && Array.isArray(enhancedQA.health_topics)) {
        for (const topic of enhancedQA.health_topics) {
          if (topic.keywords && topic.keywords.some(kw => lowerMessage.includes(kw.toLowerCase()))) {
            response = topic.response;
            responseCache.set(cacheKey, response);
            return response;
          }
        }
      }
      
      // Default response
      response = "I understand you have a health question. Could you provide more details about your symptoms or what you'd like to know?";
      responseCache.set(cacheKey, response);
      return response;
      
    } catch (error) {
      console.error('Error:', error);
      return "I'm having trouble processing your request. Please try again.";
    }
  }
};
