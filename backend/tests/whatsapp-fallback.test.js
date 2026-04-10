/**
 * WhatsApp Webhook Fallback Chain Integration Tests
 * 
 * Tests the integration of Grok API into the WhatsApp webhook fallback chain.
 * Verifies that Grok is correctly positioned between Gemini and Rasa.
 * 
 * Requirements: 2.1, 2.4, 4.1, 4.2, 4.4, 4.5
 */

const express = require('express');
const request = require('supertest');

// Mock all services before requiring the route
jest.mock('../services/twilio-service', () => ({
  sendWhatsApp: jest.fn().mockResolvedValue(true)
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

const twilioService = require('../services/twilio-service');
const langchainService = require('../services/langchain-service');
const grokService = require('../services/grok-service');
const rasaService = require('../services/rasa-service');
const nlpService = require('../services/nlp-service-enhanced');
const cacheService = require('../services/cache-service');
const whatsappWebhook = require('../routes/whatsappWebhook');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/whatsapp', whatsappWebhook);

describe('WhatsApp Webhook Fallback Chain with Grok', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Default: no cached response
    cacheService.getCachedResponse.mockReturnValue(null);
  });

  describe('Requirement 2.1: Grok fallback when Gemini fails', () => {
    test('should attempt Grok when Gemini fails', async () => {
      // Arrange
      const userMessage = 'I have a headache';
      const grokResponse = 'Headaches can be caused by various factors...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini quota exceeded'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(langchainService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(rasaService.processMessage).not.toHaveBeenCalled();
      expect(twilioService.sendWhatsApp).toHaveBeenCalledWith('+1234567890', grokResponse);
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
    });
  });

  describe('Requirement 2.4: Service selection logging', () => {
    test('should log Grok service selection', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const userMessage = 'What are symptoms of flu?';
      const grokResponse = 'Flu symptoms include...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('🤖 Attempting Grok API processing...');
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('✅ Response via grok sent successfully'));
      
      consoleSpy.mockRestore();
    });
  });

  describe('Requirement 4.1: Grok failure triggers Rasa', () => {
    test('should attempt Rasa when both Gemini and Grok fail', async () => {
      // Arrange
      const userMessage = 'Tell me about vaccination';
      const rasaResponse = 'Vaccination helps protect against diseases.';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok quota exceeded'));
      rasaService.processMessage.mockResolvedValue(rasaResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(langchainService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(rasaService.processMessage).toHaveBeenCalledWith(userMessage, '+1234567890');
      expect(twilioService.sendWhatsApp).toHaveBeenCalledWith('+1234567890', rasaResponse);
    });
  });

  describe('Requirement 4.2: Fallback trigger logging', () => {
    test('should log fallback triggers correctly', async () => {
      // Arrange
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const userMessage = 'Test message';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini error'));
      grokService.processMessage.mockRejectedValue(new Error('Grok error'));
      rasaService.processMessage.mockResolvedValue('Rasa response');
      
      // Act
      await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ Gemini failed, falling back to Grok:', 'Gemini error');
      expect(consoleWarnSpy).toHaveBeenCalledWith('⚠️ Grok failed, falling back to Rasa:', 'Grok error');
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Requirement 4.4: Service metadata in response', () => {
    test('should include service name in response metadata', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const userMessage = 'Health query';
      const grokResponse = 'Health advice...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(consoleSpy).toHaveBeenCalledWith('✅ Response via grok sent successfully');
      
      consoleSpy.mockRestore();
    });
  });

  describe('Requirement 4.5: Complete fallback chain', () => {
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
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(langchainService.processMessage).toHaveBeenCalled();
      expect(grokService.processMessage).toHaveBeenCalled();
      expect(rasaService.processMessage).toHaveBeenCalled();
      expect(nlpService.processMessage).toHaveBeenCalled();
      expect(twilioService.sendWhatsApp).toHaveBeenCalledWith('+1234567890', nlpResponse);
    });
  });

  describe('Cache behavior', () => {
    test('should return cached response without invoking services', async () => {
      // Arrange
      const userMessage = 'Cached query';
      const cachedResponse = 'This is a cached response';
      
      cacheService.getCachedResponse.mockReturnValue(cachedResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(userMessage);
      expect(langchainService.processMessage).not.toHaveBeenCalled();
      expect(grokService.processMessage).not.toHaveBeenCalled();
      expect(twilioService.sendWhatsApp).toHaveBeenCalledWith('+1234567890', cachedResponse);
    });
  });

  describe('Response truncation', () => {
    test('should truncate long responses for WhatsApp', async () => {
      // Arrange
      const userMessage = 'Long response query';
      const longResponse = 'A'.repeat(1600) + '\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(longResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      const sentMessage = twilioService.sendWhatsApp.mock.calls[0][1];
      expect(sentMessage.length).toBeLessThanOrEqual(1600);
      expect(sentMessage).toContain('For complete information, please visit: https://ayurva-chatbot.vercel.app');
    });

    test('should truncate Grok responses exceeding 1500 characters (Requirement 4.3)', async () => {
      // Arrange
      const userMessage = 'Tell me about diabetes in detail';
      const longGrokResponse = 'Diabetes is a chronic condition...' + 'X'.repeat(1500) + '\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini quota exceeded'));
      grokService.processMessage.mockResolvedValue(longGrokResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert - Requirement 4.3
      expect(response.status).toBe(200);
      const sentMessage = twilioService.sendWhatsApp.mock.calls[0][1];
      
      // Verify truncation occurred
      expect(sentMessage.length).toBeLessThan(longGrokResponse.length);
      
      // Verify message starts with first 1500 chars of original
      expect(sentMessage.substring(0, 100)).toBe(longGrokResponse.substring(0, 100));
      
      // Verify ellipsis and link appended
      expect(sentMessage).toContain('...');
      expect(sentMessage).toContain('For complete information, please visit: https://ayurva-chatbot.vercel.app');
      
      // Verify total length is reasonable (1500 + ellipsis + link)
      expect(sentMessage.length).toBeLessThanOrEqual(1600);
    });

    test('should NOT truncate Grok responses under 1500 characters', async () => {
      // Arrange
      const userMessage = 'Short query';
      const shortGrokResponse = 'This is a short response about health.\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(shortGrokResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      const sentMessage = twilioService.sendWhatsApp.mock.calls[0][1];
      
      // Verify NO truncation occurred
      expect(sentMessage).toBe(shortGrokResponse);
      expect(sentMessage).not.toContain('For complete information, please visit');
    });
  });

  describe('Backward compatibility - /incoming endpoint', () => {
    test('should support /incoming endpoint with Grok fallback', async () => {
      // Arrange
      const userMessage = 'Test via incoming';
      const grokResponse = 'Response from Grok\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(app)
        .post('/whatsapp/incoming')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert
      expect(response.status).toBe(200);
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(twilioService.sendWhatsApp).toHaveBeenCalledWith('+1234567890', grokResponse);
    });
  });
});
