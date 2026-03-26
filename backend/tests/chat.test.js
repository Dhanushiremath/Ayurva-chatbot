const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

// Mock Mongoose
jest.mock('mongoose', () => ({
  connect: jest.fn().mockResolvedValue(true),
  model: jest.fn().mockReturnValue({}),
  Schema: jest.fn().mockImplementation(() => ({
    index: jest.fn()
  }))
}));

const nlpService = require('../services/nlp-service');

const app = express();
app.use(express.json());
app.use('/api/chat', require('../routes/chatRoutes'));

describe('Chat API', () => {
  it('should process a greeting message', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ message: 'Hello', userId: 'test_user', language: 'en' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.response).toContain('Ayurva');
    expect(res.body.intent).toEqual('greeting');
  });

  it('should process a symptom message and trigger multi-turn logic', async () => {
    // First turn
    const res1 = await request(app)
      .post('/api/chat')
      .send({ message: 'I have a fever', userId: 'user_1', language: 'en' });
    
    expect(res1.body.response).toContain('What symptoms');

    // Second turn
    const res2 = await request(app)
      .post('/api/chat')
      .send({ message: 'Also headache', userId: 'user_1', language: 'en' });
    
    expect(res2.body.response).toContain('Have you seen a doctor');
  });
});
