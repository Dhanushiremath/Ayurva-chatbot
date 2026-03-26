require('dotenv').config();
const axios = require('axios');

async function checkQuota() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  console.log('='.repeat(70));
  console.log('📊 GOOGLE GEMINI API QUOTA CHECK');
  console.log('='.repeat(70));
  
  try {
    // Get model information including rate limits
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash?key=${apiKey}`
    );
    
    const model = response.data;
    
    console.log('\n📋 Model Information:');
    console.log(`   Name: ${model.name}`);
    console.log(`   Display Name: ${model.displayName}`);
    console.log(`   Description: ${model.description}`);
    
    console.log('\n⚙️ Input/Output Limits:');
    console.log(`   Input Token Limit: ${model.inputTokenLimit?.toLocaleString() || 'N/A'}`);
    console.log(`   Output Token Limit: ${model.outputTokenLimit?.toLocaleString() || 'N/A'}`);
    
    console.log('\n🔄 Supported Methods:');
    model.supportedGenerationMethods?.forEach(method => {
      console.log(`   ✅ ${method}`);
    });
    
    // Test rate limits by making multiple requests
    console.log('\n🧪 Testing Rate Limits...');
    console.log('   Making 10 rapid requests to check limits...\n');
    
    let successCount = 0;
    let failCount = 0;
    const startTime = Date.now();
    
    for (let i = 1; i <= 10; i++) {
      try {
        const testResponse = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            contents: [{
              parts: [{ text: `Test ${i}` }]
            }]
          }
        );
        successCount++;
        process.stdout.write(`   ✅ Request ${i}/10 - Success\n`);
      } catch (error) {
        failCount++;
        if (error.response?.status === 429) {
          console.log(`   ⚠️ Request ${i}/10 - RATE LIMIT EXCEEDED`);
          console.log(`   Error: ${error.response.data.error.message}`);
        } else {
          console.log(`   ❌ Request ${i}/10 - Error: ${error.response?.status || error.message}`);
        }
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('\n' + '─'.repeat(70));
    console.log('📈 Rate Limit Test Results:');
    console.log(`   ✅ Successful: ${successCount}/10`);
    console.log(`   ❌ Failed: ${failCount}/10`);
    console.log(`   ⏱️ Duration: ${duration} seconds`);
    console.log(`   📊 Rate: ${(successCount / (duration / 60)).toFixed(1)} requests/minute`);
    
    console.log('\n' + '='.repeat(70));
    console.log('💡 QUOTA INFORMATION FOR FREE TIER:');
    console.log('='.repeat(70));
    console.log('\n   According to Google AI Studio documentation:');
    console.log('   • Rate Limit: 15 requests per minute (RPM)');
    console.log('   • Daily Limit: 1,500 requests per day (RPD)');
    console.log('   • Token Limit: 1 million tokens per minute (TPM)');
    console.log('   • Free tier: No cost');
    console.log('\n   ⚠️ If you exceed these limits:');
    console.log('   • You\'ll get 429 (Too Many Requests) errors');
    console.log('   • Your app will automatically fall back to Rasa/Local NLP');
    console.log('   • Wait 1 minute and try again');
    
    console.log('\n' + '='.repeat(70));
    
  } catch (error) {
    console.error('\n❌ Error:', error.response?.data || error.message);
  }
}

checkQuota();
