const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilio-service');
const langchainService = require('../services/langchain-service');
const grokService = require('../services/grok-service');
const rasaService = require('../services/rasa-service');
const nlpService = require('../services/nlp-service-enhanced');
const cacheService = require('../services/cache-service');

/**
 * Process WhatsApp message with caching and fallback
 */
async function processWhatsAppMessage(body, phoneNumber) {
  // Check cache first
  const cachedResponse = cacheService.getCachedResponse(body);
  if (cachedResponse) {
    console.log('⚡ Using cached response (instant)');
    return { response: cachedResponse, service: 'cache' };
  }

  let responseMessage = '';
  let usedService = 'grok';
  
  try {
    console.log('🤖 Processing with Grok AI...');
    responseMessage = await grokService.processMessage(body);
    console.log(`✅ Response via grok sent successfully (${responseMessage.length} chars)`);
  } catch (grokError) {
    console.warn('⚠️ Grok failed, falling back to Gemini:', grokError.message);
    usedService = 'gemini';
    
    try {
      console.log('🧠 Attempting LangChain + Gemini AI...');
      responseMessage = await langchainService.processMessage(body);
    } catch (lcError) {
      console.warn('⚠️ Gemini failed, falling back to Rasa:', lcError.message);
      usedService = 'rasa';
      
      try {
        responseMessage = await rasaService.processMessage(body, phoneNumber);
      } catch (rasaError) {
        console.warn('⚠️ Rasa failed, falling back to local NLP:', rasaError.message);
        usedService = 'local-nlp';
        
        try {
          responseMessage = await nlpService.processMessage(body, phoneNumber);
        } catch (nlpError) {
          console.error('❌ All services failed:', nlpError);
          responseMessage = `Hello! I'm Ayurva, your AI healthcare assistant powered by Grok AI.\n\nI can help you with:\n• Symptom analysis\n• Disease information\n• Health advice\n• Emergency detection\n\nWhat would you like to know?`;
        }
      }
    }
  }

  // Cache the response
  cacheService.setCachedResponse(body, responseMessage);
  
  return { response: responseMessage, service: usedService };
}

/**
 * WhatsApp Webhook - Receives incoming messages from users
 * Twilio will POST to this endpoint when users send messages
 */
router.post('/webhook', async (req, res) => {
  try {
    const { Body, From, ProfileName } = req.body;
    
    console.log('=== Incoming WhatsApp Message ===');
    console.log('From:', From);
    console.log('Name:', ProfileName);
    console.log('Message:', Body);

    // Extract phone number (remove 'whatsapp:' prefix)
    const phoneNumber = From.replace('whatsapp:', '');

    // Process message with caching
    const { response: responseMessage, service: usedService } = await processWhatsAppMessage(Body, phoneNumber);

    console.log(`✅ Response via ${usedService} sent successfully`);

    // Truncate response if too long for WhatsApp (1600 char limit)
    let finalResponse = responseMessage;
    if (finalResponse.length > 1500) {
      finalResponse = finalResponse.substring(0, 1500) + '...\n\nFor complete information, please visit: https://ayurva-chatbot.vercel.app';
    }

    // Send response back via WhatsApp
    await twilioService.sendWhatsApp(phoneNumber, finalResponse);
    
    // Respond to Twilio with empty TwiML (required)
    res.type('text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
    
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).send('Error processing message');
  }
});

// Also support /incoming for backward compatibility
router.post('/incoming', async (req, res) => {
  try {
    const { Body, From, ProfileName } = req.body;
    
    console.log('=== Incoming WhatsApp Message ===');
    console.log('From:', From);
    console.log('Name:', ProfileName);
    console.log('Message:', Body);

    // Extract phone number (remove 'whatsapp:' prefix)
    const phoneNumber = From.replace('whatsapp:', '');

    // Process message with caching
    const { response: responseMessage, service: usedService } = await processWhatsAppMessage(Body, phoneNumber);

    console.log(`✅ Response via ${usedService} sent successfully`);

    // Truncate response if too long for WhatsApp (1600 char limit)
    let finalResponse = responseMessage;
    if (finalResponse.length > 1500) {
      finalResponse = finalResponse.substring(0, 1500) + '...\n\nFor complete information, please visit: https://ayurva-chatbot.vercel.app';
    }

    // Send response back via WhatsApp
    await twilioService.sendWhatsApp(phoneNumber, finalResponse);
    
    // Respond to Twilio with empty TwiML (required)
    res.type('text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
    
  } catch (error) {
    console.error('❌ Webhook Error:', error);
    res.status(500).send('Error processing message');
  }
});

/**
 * WhatsApp Status Webhook - Receives delivery status updates
 */
router.post('/status', (req, res) => {
  const { MessageStatus, MessageSid, To } = req.body;
  console.log(`Message ${MessageSid} to ${To}: ${MessageStatus}`);
  res.sendStatus(200);
});

module.exports = router;
