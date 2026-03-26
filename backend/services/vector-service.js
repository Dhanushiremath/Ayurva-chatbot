const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");
const fs = require('fs');
const path = require('path');

class VectorService {
  constructor() {
    this.vectorStore = null;
    this.embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
    });
  }

  /**
   * Initialize Vector Store from medical_knowledge.json
   */
  async init() {
    try {
      const knowledgePath = path.join(__dirname, '../data/medical_knowledge.json');
      const rawData = JSON.parse(fs.readFileSync(knowledgePath, 'utf8'));
      
      // Flatten JSON into document strings
      const docs = [];
      
      // Process Symptoms
      if (rawData.symptoms) {
        for (const [name, info] of Object.entries(rawData.symptoms)) {
          docs.push(`Symptom: ${name.replace(/_/g, ' ')}\nDescription: ${info.description}\nAdvice: ${info.advice}`);
        }
      }
      
      // Process Conditions
      if (rawData.conditions) {
        for (const [name, info] of Object.entries(rawData.conditions)) {
          docs.push(`Condition: ${info.name}\nTreatment: ${info.treatment}\nPrevention: ${info.prevention}`);
        }
      }

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });

      const splitDocs = await splitter.createDocuments(docs);

      console.log(`📦 Vectorizing ${splitDocs.length} medical document chunks...`);
      
      this.vectorStore = await HNSWLib.fromDocuments(splitDocs, this.embeddings);
      console.log('✅ Vector Store ready.');
    } catch (error) {
      console.error('❌ Vector Initialization failed:', error.message);
    }
  }

  /**
   * Search for context relevant to query
   * @param {string} query 
   * @returns {Promise<string>}
   */
  async getContext(query) {
    if (!this.vectorStore) await this.init();
    
    const results = await this.vectorStore.similaritySearch(query, 3);
    return results.map(r => r.pageContent).join('\n\n');
  }
}

module.exports = new VectorService();
