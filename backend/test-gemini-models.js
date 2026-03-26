require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function listModels() {
  try {
    console.log('🔍 Checking available Gemini models...\n');
    
    // Try different model names
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro',
      'models/gemini-1.5-flash'
    ];
    
    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent('Hello');
        const response = await result.response;
        console.log(`✅ ${modelName}: WORKING`);
        console.log(`   Response: ${response.text().substring(0, 50)}...\n`);
        break; // Stop after first working model
      } catch (error) {
        console.log(`❌ ${modelName}: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
