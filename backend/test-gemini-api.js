require('dotenv').config();
const axios = require('axios');

async function testGeminiAPI() {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  console.log('🔍 Testing Google Gemini API...\n');
  console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '❌ Missing');
  
  // Test 1: List available models
  try {
    console.log('\n1️⃣ Listing available models...');
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    console.log('✅ Available models:');
    response.data.models.forEach(model => {
      if (model.name.includes('gemini')) {
        console.log(`   - ${model.name}`);
        console.log(`     Supported: ${model.supportedGenerationMethods.join(', ')}`);
      }
    });
  } catch (error) {
    console.log('❌ Error listing models:', error.response?.data || error.message);
  }
  
  // Test 2: Try generating content with different API versions
  const modelsToTest = [
    { version: 'v1beta', model: 'gemini-pro' },
    { version: 'v1', model: 'gemini-pro' },
    { version: 'v1beta', model: 'gemini-1.5-flash' },
    { version: 'v1', model: 'gemini-1.5-flash' },
  ];
  
  console.log('\n2️⃣ Testing content generation...');
  for (const { version, model } of modelsToTest) {
    try {
      const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
      const response = await axios.post(url, {
        contents: [{
          parts: [{ text: 'Say hello' }]
        }]
      });
      
      console.log(`✅ ${version}/${model}: WORKING`);
      console.log(`   Response: ${response.data.candidates[0].content.parts[0].text.substring(0, 50)}...\n`);
      break;
    } catch (error) {
      console.log(`❌ ${version}/${model}: ${error.response?.status} ${error.response?.statusText}`);
    }
  }
}

testGeminiAPI();
