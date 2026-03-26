const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilio-service');
const langchainService = require('../services/langchain-service');
const rasaService = require('../services/rasa-service');
const nlpService = require('../services/nlp-service-enhanced');

/**
 * WhatsApp Webhook - Receives incoming messages from users
 * Twilio will POST to this endpoint when users send messages
 */
router.post('/incoming', async (req, res) => {
  try {
    const { Body, From, ProfileName } = req.body;
    
    console.log('=== Incoming WhatsApp Message ===');
    console.log('From:', From);
    console.log('Name:', ProfileName);
    console.log('Message:', Body);

    // Extract phone number (remove 'whatsapp:' prefix)
    const phoneNumber = From.replace('whatsapp:', '');

    // Process the message with LangChain (Gemini AI) primary, then fallbacks
    let responseMessage = '';
    let usedService = 'langchain';
    
    try {
      console.log('🧠 Processing with LangChain + Gemini AI...');
      responseMessage = await langchainService.processMessage(Body);
    } catch (lcError) {
      console.warn('⚠️ LangChain failed, falling back to Rasa:', lcError.message);
      usedService = 'rasa';
      
      try {
        responseMessage = await rasaService.processMessage(Body, phoneNumber);
      } catch (rasaError) {
        console.warn('⚠️ Rasa failed, falling back to local NLP:', rasaError.message);
        usedService = 'local-nlp';
        
        try {
          responseMessage = await nlpService.processMessage(Body, phoneNumber);
        } catch (nlpError) {
          console.error('❌ All services failed:', nlpError);
          responseMessage = `Hello! I'm Ayurva, your AI healthcare assistant powered by Google Gemini.\n\nI can help you with:\n• Symptom analysis\n• Disease information\n• Health advice\n• Emergency detection\n\nWhat would you like to know?`;
        }
      }
    }

    console.log(`✅ Response via ${usedService} sent successfully`);

    // Send response back via WhatsApp
    await twilioService.sendWhatsApp(phoneNumber, responseMessage);
    
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
