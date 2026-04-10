/**
 * Web Chat Fallback Chain Integration Tests
 * 
 * Tests the integration of Grok API into the web chat fallback chain.
 * Verifies that Grok is correctly positioned between Gemini and Rasa.
 * 
 * Task 5.3: Write integration tests for web chat fallback chain
 * Requirements: 5.1, 5.2, 5.3, 5.5
 */

const express = require('express');
const request = require('supertest');

// Mock all services before requiring the route
jest.mock('../services/vector-service', () => ({
  searchMedicalKnowledge: jest.fn(),
  addDocument: jest.fn()
}));

jest.mock('../services/langchain-service', () => ({
  processMessage: jest.fn()
}));

jest.mock('../services/grok-service', () => ({
  processMessage: jest.fn()
}));

jest.mock('../services/rasa-service', () => ({
  processMessage: jest.fn()
}));

jest.mock('../services/nlp-service-enhanced', () => ({
  processMessage: jest.fn()
}));

jest.mock('../services/cache-service', () => ({
  getCachedResponse: jest.fn(),
  setCachedResponse: jest.fn()
}));

const langchainService = require('../services/langchain-service');
const grokService = require('../services/grok-service');
const rasaService = require('../services/rasa-service');
const nlpService = require('../services/nlp-service-enhanced');
const cacheService = require('../services/cache-service');
const chatRoutes = require('../routes/chatRoutes');

const app = express();
app.use(express.json());
app.use('/api/chat', chatRoutes);

describe('Web Chat Fallback Chain Integration with Grok', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default: no cached response
    cacheService.getCachedResponse.mockReturnValue(null);
  });

  describe('Requirement 5.1: Gemini failure triggers Grok attempt', () => {
    test('should attempt Grok when Gemini fails', async () => {
      // Arrange
      const userMessage = 'I have a headache';
      const grokResponse = 'Headaches can be caused by various factors...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini quota exceeded'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(langchainService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(rasaService.processMessage).not.toHaveBeenCalled();
      expect(response.body.response).toBe(grokResponse);
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
    });

    test('should log Grok attempt when Gemini fails', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const userMessage = 'What are symptoms of flu?';
      const grokResponse = 'Flu symptoms include fever, cough, and fatigue.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ LangChain failed, falling back to Grok:', 'Gemini failed');
      expect(consoleSpy).toHaveBeenCalledWith('🤖 Attempting Grok API processing...');
      expect(consoleSpy).toHaveBeenCalledWith('✅ Response via grok sent successfully');
      
      consoleSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Requirement 5.2: Grok success returns JSON response', () => {
    test('should return JSON response with correct structure when Grok succeeds', async () => {
      // Arrange
      const userMessage = 'Tell me about diabetes';
      const grokResponse = 'Diabetes is a metabolic disorder affecting blood sugar levels.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini unavailable'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('intent');
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('cached');
      expect(response.body.response).toBe(grokResponse);
      expect(response.body.intent).toBe('processed');
    });

    test('should return complete JSON with all metadata fields', async () => {
      // Arrange
      const userMessage = 'What is hypertension?';
      const grokResponse = 'Hypertension is high blood pressure.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini error'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.body).toEqual({
        response: grokResponse,
        intent: 'processed',
        service: 'grok',
        cached: false
      });
    });
  });

  describe('Requirement 5.3: Service field correctly identifies Grok', () => {
    test('should set service field to "grok" when Grok processes the message', async () => {
      // Arrange
      const userMessage = 'Health advice needed';
      const grokResponse = 'Here is some health advice.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini quota exceeded'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.service).toBe('grok');
      expect(response.body.cached).toBe(false);
    });

    test('should distinguish Grok from other services in metadata', async () => {
      // Arrange
      const userMessage = 'Medical question';
      const grokResponse = 'Medical response from Grok.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.body.service).toBe('grok');
      expect(response.body.service).not.toBe('langchain');
      expect(response.body.service).not.toBe('rasa');
      expect(response.body.service).not.toBe('local-nlp');
      expect(response.body.service).not.toBe('cache');
    });
  });

  describe('Requirement 5.5: HTTP 200 returned for successful processing', () => {
    test('should return HTTP 200 when Grok successfully processes message', async () => {
      // Arrange
      const userMessage = 'Test message';
      const grokResponse = 'Test response.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
    });

    test('should return HTTP 200 even when Gemini fails but Grok succeeds', async () => {
      // Arrange
      const userMessage = 'Emergency query';
      const grokResponse = 'Emergency response.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini timeout'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.response).toBe(grokResponse);
    });
  });

  describe('Complete fallback chain integration', () => {
    test('should attempt Rasa when both Gemini and Grok fail', async () => {
      // Arrange
      const userMessage = 'Tell me about vaccination';
      const rasaResponse = 'Vaccination helps protect against diseases.';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok quota exceeded'));
      rasaService.processMessage.mockResolvedValue(rasaResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(langchainService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(rasaService.processMessage).toHaveBeenCalledWith(userMessage, 'test_user_123');
      expect(response.body.service).toBe('rasa');
      expect(response.body.response).toBe(rasaResponse);
    });

    test('should use local NLP when all AI services fail', async () => {
      // Arrange
      const userMessage = 'Emergency help';
      const nlpResponse = 'Local NLP response';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockRejectedValue(new Error('Rasa failed'));
      nlpService.processMessage.mockResolvedValue(nlpResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(langchainService.processMessage).toHaveBeenCalled();
      expect(grokService.processMessage).toHaveBeenCalled();
      expect(rasaService.processMessage).toHaveBeenCalled();
      expect(nlpService.processMessage).toHaveBeenCalled();
      expect(response.body.service).toBe('local-nlp');
      expect(response.body.response).toBe(nlpResponse);
    });

    test('should log complete fallback chain execution', async () => {
      // Arrange
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const userMessage = 'Test fallback chain';
      const rasaResponse = 'Rasa response';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini error'));
      grokService.processMessage.mockRejectedValue(new Error('Grok error'));
      rasaService.processMessage.mockResolvedValue(rasaResponse);
      
      // Act
      await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ LangChain failed, falling back to Grok:', 'Gemini error');
      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ Grok failed, falling back to Rasa:', 'Grok error');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Cache integration with Grok', () => {
    test('should return cached response without invoking Grok', async () => {
      // Arrange
      const userMessage = 'Cached query';
      const cachedResponse = 'This is a cached response';
      
      cacheService.getCachedResponse.mockReturnValue(cachedResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(userMessage);
      expect(langchainService.processMessage).not.toHaveBeenCalled();
      expect(grokService.processMessage).not.toHaveBeenCalled();
      expect(response.body.service).toBe('cache');
      expect(response.body.cached).toBe(true);
      expect(response.body.response).toBe(cachedResponse);
    });

    test('should cache Grok responses for future requests', async () => {
      // Arrange
      const userMessage = 'New query';
      const grokResponse = 'Fresh Grok response.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
      expect(response.body.cached).toBe(false);
    });
  });

  describe('Error handling', () => {
    test('should return HTTP 500 only when all services fail', async () => {
      // Arrange
      const userMessage = 'Test complete failure';
      
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockRejectedValue(new Error('Rasa failed'));
      nlpService.processMessage.mockRejectedValue(new Error('Local NLP failed'));
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Failed to process message');
    });

    test('should NOT return HTTP 500 when Grok succeeds after Gemini fails', async () => {
      // Arrange
      const userMessage = 'Test partial failure';
      const grokResponse = 'Grok saves the day.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.status).not.toBe(500);
    });
  });

  describe('Medical context preservation', () => {
    test('should maintain medical disclaimer in Grok responses', async () => {
      // Arrange
      const userMessage = 'Medical advice';
      const grokResponse = 'Medical information here.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/api/chat')
        .send({
          message: userMessage,
          userId: 'test_user_123'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(response.body.response).toContain('*Disclaimer: I am an AI assistant, not a doctor');
    });
  });
});
