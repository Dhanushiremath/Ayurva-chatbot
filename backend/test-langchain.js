require('dotenv').config();

console.log('='.repeat(60));
console.log('🔍 LangChain Implementation Status Check');
console.log('='.repeat(60));

// 1. Check Environment Variables
console.log('\n1️⃣ Environment Variables:');
console.log('   GOOGLE_API_KEY:', process.env.GOOGLE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Set' : '❌ Missing');

// 2. Check Dependencies
console.log('\n2️⃣ Checking Dependencies:');
try {
  const langchain = require('langchain');
  console.log('   ✅ langchain:', langchain ? 'Installed' : 'Not found');
} catch (e) {
  console.log('   ❌ langchain:', e.message);
}

try {
  const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
  console.log('   ✅ @langchain/google-genai: Installed');
} catch (e) {
  console.log('   ❌ @langchain/google-genai:', e.message);
}

try {
  const { HNSWLib } = require('@langchain/community/vectorstores/hnswlib');
  console.log('   ✅ @langchain/community: Installed');
} catch (e) {
  console.log('   ❌ @langchain/community:', e.message);
}

try {
  const { DynamicTool } = require('@langchain/core/tools');
  console.log('   ✅ @langchain/core: Installed');
} catch (e) {
  console.log('   ❌ @langchain/core:', e.message);
}

// 3. Test LangChain Service
console.log('\n3️⃣ Testing LangChain Service:');
try {
  const langchainService = require('./services/langchain-service');
  console.log('   ✅ LangChain Service loaded successfully');
  
  // Test initialization
  (async () => {
    try {
      await langchainService.init();
      console.log('   ✅ LangChain Agent initialized');
      
      // Test a simple query
      console.log('\n4️⃣ Testing Query Processing:');
      const testMessage = 'What are the symptoms of fever?';
      console.log('   Query:', testMessage);
      
      const response = await langchainService.processMessage(testMessage);
      console.log('   ✅ Response received:', response.substring(0, 100) + '...');
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ LangChain Implementation: WORKING');
      console.log('='.repeat(60));
    } catch (error) {
      console.log('   ❌ Error during processing:', error.message);
      console.log('\n' + '='.repeat(60));
      console.log('❌ LangChain Implementation: FAILED');
      console.log('Error:', error.message);
      console.log('='.repeat(60));
    }
  })();
  
} catch (e) {
  console.log('   ❌ Failed to load LangChain Service:', e.message);
  console.log('\n' + '='.repeat(60));
  console.log('❌ LangChain Implementation: FAILED');
  console.log('Error:', e.message);
  console.log('='.repeat(60));
}
