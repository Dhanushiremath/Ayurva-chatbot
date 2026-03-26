const { initializeAgentExecutorWithOptions } = require("@langchain/classic/agents");
const { BufferMemory } = require("@langchain/classic/memory");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { clinicalTools } = require("../utils/langchain/clinical-tools");
const vectorService = require('./vector-service');

class LangChainService {
  constructor() {
    this.memory = new BufferMemory({
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input"
    });

    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      maxOutputTokens: 2048,
      apiKey: process.env.GOOGLE_API_KEY,
      temperature: 0.7,
    });

    this.executor = null;
  }

  async init() {
    if (this.executor) return;

    const prefix = `You are Ayurva, an advanced AI healthcare assistant. 
      Your goal is to provide helpful, empathetic, and medically-grounded information.
      
      CRITICAL RULES:
      1. You are NOT a doctor. Always include a disclaimer that this is for informational purposes.
      2. If symptoms sound life-threatening (chest pain, severe bleeding, difficulty breathing), advisor emergency services immediately.
      3. Never prescribe specific medication dosages.`;

    this.executor = await initializeAgentExecutorWithOptions(
      clinicalTools,
      this.llm,
      {
        agentType: "zero-shot-react-description",
        memory: this.memory,
        agentArgs: {
          prefix: prefix
        }
      }
    );
    console.log('✅ LangChain Agent Executor ready.');
  }

  /**
   * Process user message through LangChain Agent
   * @param {string} input - User message
   * @returns {Promise<string>} - AI response
   */
  async processMessage(input) {
    try {
      if (!this.executor) await this.init();
      
      console.log('🔗 LangChain Agent processing:', input);
      
      const response = await this.executor.call({ input: input });
      
      const disclaimer = "\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*";
      
      return response.output + disclaimer;
    } catch (error) {
      console.error('❌ LangChain error:', error.message);
      
      // Always throw error to trigger fallback system
      if (error.message.includes('quota') || error.message.includes('exceeded')) {
        throw new Error('Quota exceeded - triggering fallback');
      }
      
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Reset the conversational memory
   */
  async clearHistory() {
    await this.memory.clear();
  }
}

module.exports = new LangChainService();
