require('dotenv').config();
const nlpService = require('./services/nlp-service');

async function test(query) {
    console.log(`\nTesting Responsiveness: "${query}"`);
    try {
        const result = await nlpService.processMessage(query);
        console.log('Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

async function runTests() {
    await test("body itching");
    await test("What is dengue?");
    await test("How to improve my sleep?");
}

runTests();
