require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load the webhook route
const whatsappWebhook = require('./routes/whatsappWebhook');
app.use('/api/whatsapp', whatsappWebhook);

console.log('='.repeat(70));
console.log('🧪 Testing WhatsApp Webhook with LangChain');
console.log('='.repeat(70));

// Start server
const PORT = 5001; // Different port to avoid conflict
app.listen(PORT, async () => {
  console.log(`\n✅ Test server running on http://localhost:${PORT}`);
  console.log('\nNow testing webhook with sample messages...\n');
  
  // Wait a moment for server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test with axios
  const axios = require('axios');
  
  const testMessages = [
    'I have fever and headache',
    'What are symptoms of diabetes?',
    'Hello'
  ];
  
  for (let i = 0; i < testMessages.length; i++) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`\n📱 Test Message ${i + 1}: "${testMessages[i]}"`);
    console.log('⏳ Processing...\n');
    
    try {
      const response = await axios.post(`http://localhost:${PORT}/api/whatsapp/incoming`, {
        Body: testMessages[i],
        From: 'whatsapp:+919876543210',
        ProfileName: 'Test User'
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      console.log('✅ Webhook responded successfully');
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
    
    // Wait between requests
    if (i < testMessages.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ Test Complete! Check the logs above to see which service was used.');
  console.log('='.repeat(70));
  
  process.exit(0);
});
