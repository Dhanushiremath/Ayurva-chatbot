require('dotenv').config();

console.log('='.repeat(70));
console.log('🧪 Testing Fallback System');
console.log('='.repeat(70));

async function testFallback() {
  const langchainService = require('./services/langchain-service');
  const rasaService = require('./services/rasa-service');
  const nlpService = require('./services/nlp-service-enhanced');
  
  const testMessage = 'I have fever';
  let response;
  let usedService;
  
  console.log('\n📝 Test Message:', testMessage);
  console.log('\n' + '─'.repeat(70));
  
  // Try LangChain first
  try {
    console.log('\n1️⃣ Trying LangChain + Gemini AI...');
    response = await langchainService.processMessage(testMessage);
    usedService = 'langchain';
    console.log('✅ LangChain succeeded!');
  } catch (lcError) {
    console.log('❌ LangChain failed:', lcError.message);
    
    // Fallback to Rasa
    try {
      console.log('\n2️⃣ Falling back to Rasa...');
      response = await rasaService.processMessage(testMessage, 'test-user');
      usedService = 'rasa';
      console.log('✅ Rasa succeeded!');
    } catch (rasaError) {
      console.log('❌ Rasa failed:', rasaError.message);
      
      // Fallback to Local NLP
      try {
        console.log('\n3️⃣ Falling back to Local NLP...');
        response = await nlpService.processMessage(testMessage, 'test-user');
        usedService = 'local-nlp';
        console.log('✅ Local NLP succeeded!');
      } catch (nlpError) {
        console.log('❌ All services failed!');
        response = 'Default fallback message';
        usedService = 'default';
      }
    }
  }
  
  console.log('\n' + '─'.repeat(70));
  console.log('\n📊 RESULT:');
  console.log('   Service Used:', usedService);
  console.log('   Response Length:', response.length);
  console.log('   Response Preview:', response.substring(0, 150) + '...');
  console.log('\n' + '='.repeat(70));
  console.log('✅ Fallback System Test Complete!');
  console.log('='.repeat(70));
}

testFallback().catch(console.error);
