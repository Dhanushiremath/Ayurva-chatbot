require('dotenv').config();
const langchainService = require('./services/langchain-service');

async function demo() {
  console.log('='.repeat(70));
  console.log('🤖 LANGCHAIN + GEMINI 2.5 FLASH DEMO');
  console.log('='.repeat(70));
  
  const testQueries = [
    "I have a fever and headache. What should I do?",
    "What are the symptoms of diabetes?",
    "I'm having chest pain. Is this serious?",
    "How can I prevent the flu?"
  ];
  
  for (let i = 0; i < testQueries.length; i++) {
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`\n💬 USER QUERY ${i + 1}:`);
    console.log(`   "${testQueries[i]}"`);
    console.log(`\n🤖 AYURVA RESPONSE:`);
    
    try {
      const response = await langchainService.processMessage(testQueries[i]);
      console.log(`   ${response.substring(0, 300)}...`);
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    // Wait a bit between requests to avoid rate limits
    if (i < testQueries.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log(`\n${'='.repeat(70)}`);
  console.log('✅ Demo Complete!');
  console.log('='.repeat(70));
}

demo();
