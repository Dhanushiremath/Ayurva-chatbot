require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('🧪 Testing Google Gemini API Quota...\n');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function testGemini() {
  try {
    console.log('📡 Attempting to connect to Gemini API...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const result = await model.generateContent('Say hello in one word');
    const response = result.response.text();
    
    console.log('✅ SUCCESS! Gemini API is working!');
    console.log('📝 Response:', response);
    console.log('\n🎉 Your quota has been reset!');
    
  } catch (error) {
    console.error('❌ FAILED! Gemini API Error:');
    console.error('Error message:', error.message);
    
    if (error.message.includes('429') || error.message.includes('quota')) {
      console.log('\n⏳ Quota still exhausted. It typically resets after 24 hours.');
      console.log('💡 The enhanced local service is working great without any API!');
    } else if (error.message.includes('API key')) {
      console.log('\n🔑 API key issue. Check your GOOGLE_API_KEY in .env');
    } else {
      console.log('\n🤔 Unexpected error. Details above.');
    }
  }
}

testGemini();
