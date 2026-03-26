const { DynamicTool } = require("@langchain/core/tools");
const vectorService = require("../../services/vector-service");

/**
 * Tools for the Clinical Agent
 */
const symptomAnalyzer = new DynamicTool({
  name: "symptom_analyzer",
  description: "Search the local medical knowledge base for symptoms, causes, and advice.",
  func: async (input) => {
    return await vectorService.getContext(input);
  }
});

const emergencyEscalator = new DynamicTool({
  name: "emergency_escalator",
  description: "Identify life-threatening conditions and provide immediate emergency contact info.",
  func: async (input) => {
    return "⚠️ EMERGENCY ALERT: This condition appears life-threatening. Seek immediate help! Contact: 108 (India) or 911 (US).";
  }
});

module.exports = {
  clinicalTools: [symptomAnalyzer, emergencyEscalator]
};
