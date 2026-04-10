const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilio-service');

/**
 * Test Twilio SMS
 * POST /api/test/sms
 * Body: { "phone": "+1234567890", "message": "Test message" }
 */
router.post('/sms', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    if (!phone) {
      return res.status(400).json({ 
        error: 'Phone number is required',
        example: { phone: '+1234567890', message: 'Hello from Ayurva!' }
      });
    }

    const messageBody = message || 'Hello! This is a test message from Ayurva. Your health assistant is ready to help you! 🏥';
    
    console.log(`Sending SMS to ${phone}...`);
    const messageSid = await twilioService.sendSMS(phone, messageBody);
    
    res.status(200).json({ 
      success: true,
      message: 'SMS sent successfully!',
      messageSid,
      sentTo: phone,
      body: messageBody
    });
  } catch (error) {
    console.error('Test SMS Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: error.code || 'Unknown error'
    });
  }
});

/**
 * Test Twilio WhatsApp
 * POST /api/test/whatsapp
 * Body: { "phone": "+1234567890", "message": "Test message" }
 */
router.post('/whatsapp', async (req, res) => {
  try {
    const { phone, message } = req.body;
    
    console.log('=== WhatsApp Test Request ===');
    console.log('Received phone:', phone);
    console.log('Received message:', message);
    
    if (!phone) {
      return res.status(400).json({ 
        error: 'Phone number is required',
        example: { phone: '+1234567890', message: 'Hello from Ayurva!' }
      });
    }

    const messageBody = message || 'Hello! This is a test WhatsApp message from Ayurva. 🏥';
    
    console.log(`Attempting to send WhatsApp to ${phone}...`);
    const messageSid = await twilioService.sendWhatsApp(phone, messageBody);
    
    console.log('✅ WhatsApp sent successfully!');
    console.log('Message SID:', messageSid);
    
    res.status(200).json({ 
      success: true,
      message: 'WhatsApp message sent successfully!',
      messageSid,
      sentTo: phone,
      body: messageBody
    });
  } catch (error) {
    console.error('❌ Test WhatsApp Error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      details: error.code || 'Unknown error'
    });
  }
});

/**
 * Get Twilio configuration status
 * GET /api/test/twilio-status
 */
router.get('/twilio-status', (req, res) => {
  const isConfigured = !!(process.env.TWILIO_SID && process.env.TWILIO_TOKEN && process.env.TWILIO_PHONE_NUMBER);
  
  res.status(200).json({
    configured: isConfigured,
    accountSid: process.env.TWILIO_SID ? `${process.env.TWILIO_SID.substring(0, 10)}...` : 'Not set',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'Not set',
    status: isConfigured ? 'Ready to send SMS' : 'Not configured'
  });
});

/**
 * Diagnostic endpoint to check all services
 * GET /api/test/services-status
 */
router.get('/services-status', (req, res) => {
  const geminiConfigured = !!process.env.GOOGLE_API_KEY;
  const grokConfigured = !!process.env.GROK_API_KEY;
  
  res.status(200).json({
    timestamp: new Date().toISOString(),
    services: {
      gemini: {
        configured: geminiConfigured,
        apiKey: geminiConfigured ? `${process.env.GOOGLE_API_KEY.substring(0, 10)}...` : 'Not set',
        status: geminiConfigured ? 'Configured' : 'Missing API key'
      },
      grok: {
        configured: grokConfigured,
        apiKey: grokConfigured ? `${process.env.GROK_API_KEY.substring(0, 10)}...` : 'Not set',
        model: process.env.GROK_MODEL || 'grok-beta',
        timeout: process.env.GROK_TIMEOUT || '5000',
        status: grokConfigured ? 'Configured' : 'Missing API key'
      },
      twilio: {
        configured: !!(process.env.TWILIO_SID && process.env.TWILIO_TOKEN),
        status: !!(process.env.TWILIO_SID && process.env.TWILIO_TOKEN) ? 'Configured' : 'Missing credentials'
      },
      mongodb: {
        configured: !!process.env.MONGODB_URI,
        status: !!process.env.MONGODB_URI ? 'Configured' : 'Missing URI'
      }
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
