/**
 * Cache Service Integration Tests for Grok Responses
 * 
 * Task 7.1: Update cache service integration
 * Verifies that cache service caches Grok responses identically to Gemini,
 * cache check occurs before fallback chain invocation, and cache metadata
 * is included in all responses.
 * 
 * Requirements: 6.1, 6.2, 6.3, 6.4
 */

const express = require('express');
const request = require('supertest');

// Mock all services before requiring the routes
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

jest.mock('../services/twilio-service', () => ({
  sendWhatsApp: jest.fn().mockResolvedValue(true)
}));

const langchainService = require('../services/langchain-service');
const grokService = require('../services/grok-service');
const cacheService = require('../services/cache-service');
const chatRoutes = require('../routes/chatRoutes');
const whatsappWebhook = require('../routes/whatsappWebhook');

describe('Cache Service Integration with Grok Responses - Task 7.1', () => {
  let chatApp;
  let whatsappApp;

  beforeAll(() => {
    // Set up Express apps for testing
    chatApp = express();
    chatApp.use(express.json());
    chatApp.use('/api/chat', chatRoutes);

    whatsappApp = express();
    whatsappApp.use(express.json());
    whatsappApp.use(express.urlencoded({ extended: true }));
    whatsappApp.use('/whatsapp', whatsappWebhook);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: no cached response
    cacheService.getCachedResponse.mockReturnValue(null);
  });

  describe('Requirement 6.1: Cache Grok responses identically to Gemini', () => {
    test('should cache Grok responses using same mechanism as Gemini', async () => {
      // Arrange
      const userMessage = 'What are symptoms of diabetes?';
      const grokResponse = 'Diabetes symptoms include increased thirst...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini quota exceeded'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Requirement 6.1
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
      expect(cacheService.setCachedResponse).toHaveBeenCalledTimes(1);
    });

    test('should cache Grok responses with same parameters as Gemini responses', async () => {
      // Arrange
      const userMessage = 'Tell me about hypertension';
      const geminiResponse = 'Hypertension is high blood pressure...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      const grokResponse = 'Hypertension affects blood vessels...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      // Test Gemini caching
      langchainService.processMessage.mockResolvedValue(geminiResponse);
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      const geminiCacheCall = cacheService.setCachedResponse.mock.calls[0];
      
      // Reset and test Grok caching
      jest.clearAllMocks();
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      const grokCacheCall = cacheService.setCachedResponse.mock.calls[0];
      
      // Assert - Both use identical caching mechanism
      expect(geminiCacheCall[0]).toBe(grokCacheCall[0]); // Same message key
      expect(geminiCacheCall.length).toBe(grokCacheCall.length); // Same number of parameters
    });

    test('should cache Grok responses in WhatsApp webhook identically', async () => {
      // Arrange
      const userMessage = 'Health advice needed';
      const grokResponse = 'Here is health advice...\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*';
      
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      await request(whatsappApp)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert - Requirement 6.1
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
    });
  });

  describe('Requirement 6.2: Cache check occurs before fallback chain invocation', () => {
    test('should check cache before invoking any service in fallback chain', async () => {
      // Arrange
      const userMessage = 'Cached medical query';
      const cachedResponse = 'This is a cached response from previous interaction';
      
      cacheService.getCachedResponse.mockReturnValue(cachedResponse);
      
      // Act
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Requirement 6.2
      // Cache was checked with the user message
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(userMessage);
      // No services were invoked because cache hit occurred
      expect(langchainService.processMessage).not.toHaveBeenCalled();
      expect(grokService.processMessage).not.toHaveBeenCalled();
    });

    test('should check cache as first operation in web chat route', async () => {
      // Arrange
      const userMessage = 'Test cache priority';
      cacheService.getCachedResponse.mockReturnValue('Cached result');
      
      // Act
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Cache checked first
      expect(cacheService.getCachedResponse).toHaveBeenCalledTimes(1);
      expect(langchainService.processMessage).not.toHaveBeenCalled();
      expect(grokService.processMessage).not.toHaveBeenCalled();
    });

    test('should check cache as first operation in WhatsApp webhook', async () => {
      // Arrange
      const userMessage = 'WhatsApp cache test';
      cacheService.getCachedResponse.mockReturnValue('Cached WhatsApp response');
      
      // Act
      await request(whatsappApp)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      // Assert - Cache checked before any service
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(userMessage);
      expect(langchainService.processMessage).not.toHaveBeenCalled();
      expect(grokService.processMessage).not.toHaveBeenCalled();
    });

    test('should invoke fallback chain only on cache miss', async () => {
      // Arrange
      const userMessage = 'New query not in cache';
      const grokResponse = 'Fresh Grok response';
      
      cacheService.getCachedResponse.mockReturnValue(null); // Cache miss
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Fallback chain invoked only after cache miss
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(userMessage);
      expect(langchainService.processMessage).toHaveBeenCalled();
      expect(grokService.processMessage).toHaveBeenCalled();
    });
  });

  describe('Requirement 6.3: Include cache metadata (hit/miss) in all responses', () => {
    test('should include cached=true and service=cache on cache hit', async () => {
      // Arrange
      const userMessage = 'Cached query';
      const cachedResponse = 'This is cached';
      
      cacheService.getCachedResponse.mockReturnValue(cachedResponse);
      
      // Act
      const response = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Requirement 6.3
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cached', true);
      expect(response.body).toHaveProperty('service', 'cache');
      expect(response.body.response).toBe(cachedResponse);
    });

    test('should include cached=false on cache miss with Grok response', async () => {
      // Arrange
      const userMessage = 'New query';
      const grokResponse = 'Fresh Grok response';
      
      cacheService.getCachedResponse.mockReturnValue(null); // Cache miss
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Requirement 6.3
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('cached', false);
      expect(response.body).toHaveProperty('service', 'grok');
      expect(response.body.response).toBe(grokResponse);
    });

    test('should include cache metadata in all web chat responses', async () => {
      // Arrange
      const userMessage = 'Test metadata';
      const grokResponse = 'Grok response with metadata';
      
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - All required metadata fields present
      expect(response.body).toHaveProperty('response');
      expect(response.body).toHaveProperty('intent');
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('cached');
      expect(typeof response.body.cached).toBe('boolean');
    });

    test('should distinguish between cache hit and Grok service in metadata', async () => {
      // Test 1: Cache hit
      const cachedMessage = 'Cached message';
      cacheService.getCachedResponse.mockReturnValue('Cached response');
      
      const cachedResult = await request(chatApp)
        .post('/api/chat')
        .send({ message: cachedMessage, userId: 'test_user' });
      
      expect(cachedResult.body.service).toBe('cache');
      expect(cachedResult.body.cached).toBe(true);
      
      // Test 2: Grok response (cache miss)
      jest.clearAllMocks();
      const newMessage = 'New message';
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue('Grok response');
      
      const grokResult = await request(chatApp)
        .post('/api/chat')
        .send({ message: newMessage, userId: 'test_user' });
      
      expect(grokResult.body.service).toBe('grok');
      expect(grokResult.body.cached).toBe(false);
    });
  });

  describe('Requirement 6.4: Cache stores responses from all services identically', () => {
    test('should cache responses from Gemini, Grok, Rasa, and Local NLP identically', async () => {
      const userMessage = 'Test message';
      
      // Test Gemini caching
      langchainService.processMessage.mockResolvedValue('Gemini response');
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, 'Gemini response');
      
      // Test Grok caching
      jest.clearAllMocks();
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue('Grok response');
      
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, 'Grok response');
      
      // Verify both use same caching function with same signature
      const allCalls = cacheService.setCachedResponse.mock.calls;
      expect(allCalls.every(call => call.length === 2)).toBe(true);
      expect(allCalls.every(call => typeof call[0] === 'string')).toBe(true);
      expect(allCalls.every(call => typeof call[1] === 'string')).toBe(true);
    });

    test('should use same cache service for both web chat and WhatsApp', async () => {
      const userMessage = 'Cross-platform cache test';
      const grokResponse = 'Grok response';
      
      // Web chat request
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      const webCacheCall = cacheService.setCachedResponse.mock.calls[0];
      
      // WhatsApp request
      jest.clearAllMocks();
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      await request(whatsappApp)
        .post('/whatsapp/webhook')
        .send({
          Body: userMessage,
          From: 'whatsapp:+1234567890',
          ProfileName: 'Test User'
        });
      
      const whatsappCacheCall = cacheService.setCachedResponse.mock.calls[0];
      
      // Assert - Both use identical caching
      expect(webCacheCall[0]).toBe(whatsappCacheCall[0]);
      expect(webCacheCall[1]).toBe(whatsappCacheCall[1]);
    });
  });

  describe('Cache performance with Grok responses', () => {
    test('should return cached response instantly without invoking Grok', async () => {
      // Arrange
      const userMessage = 'Performance test query';
      const cachedResponse = 'Instant cached response';
      
      cacheService.getCachedResponse.mockReturnValue(cachedResponse);
      
      const startTime = Date.now();
      
      // Act
      const response = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      const duration = Date.now() - startTime;
      
      // Assert - Fast response from cache
      expect(response.status).toBe(200);
      expect(response.body.service).toBe('cache');
      expect(response.body.cached).toBe(true);
      expect(grokService.processMessage).not.toHaveBeenCalled();
      
      // Performance expectation (should be very fast)
      expect(duration).toBeLessThan(1000); // Less than 1 second
    });

    test('should cache Grok response for subsequent identical queries', async () => {
      // Arrange
      const userMessage = 'Repeated query';
      const grokResponse = 'Grok response to be cached';
      
      // First request - cache miss, Grok processes
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Verify Grok was called and response was cached
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
      
      // Second request - cache hit
      jest.clearAllMocks();
      cacheService.getCachedResponse.mockReturnValue(grokResponse);
      
      const response = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Cached response returned, Grok not called again
      expect(response.body.service).toBe('cache');
      expect(response.body.cached).toBe(true);
      expect(response.body.response).toBe(grokResponse);
      expect(grokService.processMessage).not.toHaveBeenCalled();
    });
  });

  describe('Integration: Complete cache and fallback chain flow', () => {
    test('should follow correct flow: cache check -> Gemini -> Grok -> cache store', async () => {
      // Arrange
      const userMessage = 'Complete flow test';
      const grokResponse = 'Grok response';
      
      cacheService.getCachedResponse.mockReturnValue(null); // Cache miss
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      // Act
      const response = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      // Assert - Verify complete flow
      expect(cacheService.getCachedResponse).toHaveBeenCalledWith(userMessage);
      expect(langchainService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(grokService.processMessage).toHaveBeenCalledWith(userMessage);
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
      expect(response.body.service).toBe('grok');
      expect(response.body.cached).toBe(false);
    });

    test('should cache Grok responses and serve them on subsequent requests', async () => {
      const userMessage = 'End-to-end cache test';
      const grokResponse = 'Grok response for caching';
      
      // Request 1: Cache miss, Grok processes
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue(grokResponse);
      
      const firstResponse = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      expect(firstResponse.body.service).toBe('grok');
      expect(firstResponse.body.cached).toBe(false);
      expect(cacheService.setCachedResponse).toHaveBeenCalledWith(userMessage, grokResponse);
      
      // Request 2: Cache hit
      jest.clearAllMocks();
      cacheService.getCachedResponse.mockReturnValue(grokResponse);
      
      const secondResponse = await request(chatApp)
        .post('/api/chat')
        .send({ message: userMessage, userId: 'test_user' });
      
      expect(secondResponse.body.service).toBe('cache');
      expect(secondResponse.body.cached).toBe(true);
      expect(secondResponse.body.response).toBe(grokResponse);
      expect(grokService.processMessage).not.toHaveBeenCalled();
    });
  });
});
