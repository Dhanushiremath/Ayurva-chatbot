const express = require('express');
const router = express.Router();
const langchainService = require('../services/langchain-service');
const rasaService = require('../services/rasa-service');
const nlpService = require('../services/nlp-service-enhanced');
const cacheService = require('../services/cache-service');

console.log('🔄 Chat Routes loaded - Primary Engine: LangChain (Gemini) + RAG with Caching');

router.get('/test', (req, res) => {
  res.json({ message: 'Chat route is working!', primary: 'langchain', secondary: 'rasa' });
});

router.post('/', async (req, res) => {
  const { message, userId, language } = req.body;
  
  console.log('='.repeat(60));
  console.log('POST /api/chat - Message:', message);
  
  try {
    // Check cache first
    const cachedResponse = cacheService.getCachedResponse(message);
    if (cachedResponse) {
      console.log('⚡ Returning cached response (instant)');
      console.log('='.repeat(60));
      return res.json({ 
        response: cachedResponse,
        intent: 'processed',
        service: 'cache',
        cached: true
      });
    }
    
    let response;
    let usedService = 'langchain';
    
    try {
      // Primary: Try LangChain (High Intelligence)
      console.log('🧠 Attempting LangChain + RAG processing...');
      response = await langchainService.processMessage(message);
    } catch (lcError) {
      console.warn('⚠️ LangChain failed, falling back to Rasa:', lcError.message);
      
      try {
        // Fallback 1: Try Rasa (Structured Flow)
        usedService = 'rasa';
        response = await rasaService.processMessage(message, userId || 'user');
      } catch (rasaError) {
        // Fallback 2: Use local keyword NLP
        console.warn('⚠️ Rasa unavailable, falling back to local NLP');
        usedService = 'local-nlp';
        response = await nlpService.processMessage(message, userId);
      }
    }
    
    // Cache the response for future requests
    cacheService.setCachedResponse(message, response);
    
    console.log(`✅ Response length: ${response.length} (via ${usedService})`);
    console.log('='.repeat(60));
    
    res.json({ 
      response,
      intent: 'processed',
      service: usedService,
      cached: false
    });
  } catch (error) {
    console.error('❌ Chat route error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

module.exports = router;
