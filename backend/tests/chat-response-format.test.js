const request = require('supertest');
const express = require('express');

// Mock all services before they are imported
jest.mock('../services/vector-service', () => ({
  searchMedicalKnowledge: jest.fn(),
  addDocument: jest.fn()
}));
jest.mock('../services/langchain-service');
jest.mock('../services/grok-service');
jest.mock('../services/rasa-service');
jest.mock('../services/nlp-service-enhanced');
jest.mock('../services/cache-service');

const langchainService = require('../services/langchain-service');
const grokService = require('../services/grok-service');
const rasaService = require('../services/rasa-service');
const nlpService = require('../services/nlp-service-enhanced');
const cacheService = require('../services/cache-service');

const app = express();
app.use(express.json());
app.use('/api/chat', require('../routes/chatRoutes'));

describe('Chat API - JSON Response Format (Task 5.2)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Requirement 5.2: Return AI_Response in JSON format', () => {
    it('should return response in JSON format with all required fields', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockResolvedValue('Test response from Gemini');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.headers['content-type']).toMatch(/json/);
      expect(res.body).toHaveProperty('response');
      expect(res.body).toHaveProperty('service');
      expect(res.body).toHaveProperty('cached');
    });
  });

  describe('Requirement 5.3: Include "service" field indicating which service processed the message', () => {
    it('should include service="cache" for cached responses', async () => {
      cacheService.getCachedResponse.mockReturnValue('Cached response');

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.service).toEqual('cache');
      expect(res.body.response).toEqual('Cached response');
    });

    it('should include service="langchain" when Gemini processes the message', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockResolvedValue('Response from Gemini');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.service).toEqual('langchain');
      expect(res.body.response).toEqual('Response from Gemini');
    });

    it('should include service="grok" when Grok processes the message', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini quota exceeded'));
      grokService.processMessage.mockResolvedValue('Response from Grok');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.service).toEqual('grok');
      expect(res.body.response).toEqual('Response from Grok');
    });

    it('should include service="rasa" when Rasa processes the message', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockResolvedValue('Response from Rasa');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.service).toEqual('rasa');
      expect(res.body.response).toEqual('Response from Rasa');
    });

    it('should include service="local-nlp" when local NLP processes the message', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockRejectedValue(new Error('Rasa failed'));
      nlpService.processMessage.mockResolvedValue('Response from local NLP');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.service).toEqual('local-nlp');
      expect(res.body.response).toEqual('Response from local NLP');
    });
  });

  describe('Requirement 5.4: Include "cached" boolean field for cache hit/miss', () => {
    it('should include cached=true for cache hits', async () => {
      cacheService.getCachedResponse.mockReturnValue('Cached response');

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.cached).toEqual(true);
      expect(res.body.service).toEqual('cache');
    });

    it('should include cached=false for cache misses with Gemini', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockResolvedValue('Fresh response from Gemini');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'New question', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.cached).toEqual(false);
      expect(res.body.service).toEqual('langchain');
    });

    it('should include cached=false for cache misses with Grok', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue('Fresh response from Grok');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'New question', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.cached).toEqual(false);
      expect(res.body.service).toEqual('grok');
    });

    it('should include cached=false for cache misses with Rasa', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockResolvedValue('Fresh response from Rasa');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'New question', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.cached).toEqual(false);
      expect(res.body.service).toEqual('rasa');
    });

    it('should include cached=false for cache misses with local NLP', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockRejectedValue(new Error('Rasa failed'));
      nlpService.processMessage.mockResolvedValue('Fresh response from local NLP');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'New question', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.cached).toEqual(false);
      expect(res.body.service).toEqual('local-nlp');
    });
  });

  describe('Requirement 5.5: Return HTTP 200 for all successfully processed messages', () => {
    it('should return HTTP 200 when Gemini processes the message', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockResolvedValue('Response from Gemini');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Test message', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
    });

    it('should return HTTP 200 when Grok processes the message (Gemini failed)', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockResolvedValue('Response from Grok');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Test message', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
    });

    it('should return HTTP 200 when Rasa processes the message (Gemini and Grok failed)', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockResolvedValue('Response from Rasa');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Test message', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
    });

    it('should return HTTP 200 when local NLP processes the message (all AI services failed)', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockRejectedValue(new Error('Rasa failed'));
      nlpService.processMessage.mockResolvedValue('Response from local NLP');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Test message', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
    });

    it('should return HTTP 200 when cache returns the response', async () => {
      cacheService.getCachedResponse.mockReturnValue('Cached response');

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Test message', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
    });

    it('should return HTTP 500 only when all services fail completely', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Gemini failed'));
      grokService.processMessage.mockRejectedValue(new Error('Grok failed'));
      rasaService.processMessage.mockRejectedValue(new Error('Rasa failed'));
      nlpService.processMessage.mockRejectedValue(new Error('Local NLP failed'));

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Test message', userId: 'test_user' });

      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Integration: Complete response format validation', () => {
    it('should return complete JSON response with all metadata for Gemini', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockResolvedValue('Diabetes is a chronic condition...');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        response: 'Diabetes is a chronic condition...',
        intent: 'processed',
        service: 'langchain',
        cached: false
      });
    });

    it('should return complete JSON response with all metadata for Grok', async () => {
      cacheService.getCachedResponse.mockReturnValue(null);
      langchainService.processMessage.mockRejectedValue(new Error('Quota exceeded'));
      grokService.processMessage.mockResolvedValue('Diabetes is a metabolic disorder...');
      cacheService.setCachedResponse.mockReturnValue(undefined);

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        response: 'Diabetes is a metabolic disorder...',
        intent: 'processed',
        service: 'grok',
        cached: false
      });
    });

    it('should return complete JSON response with all metadata for cache hit', async () => {
      cacheService.getCachedResponse.mockReturnValue('Diabetes is a chronic condition affecting blood sugar...');

      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'What is diabetes?', userId: 'test_user' });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        response: 'Diabetes is a chronic condition affecting blood sugar...',
        intent: 'processed',
        service: 'cache',
        cached: true
      });
    });
  });
});
