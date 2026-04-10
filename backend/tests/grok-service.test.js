/**
 * Unit tests for Grok Service
 * Tests Task 2.2: processMessage method with medical context
 * 
 * Requirements tested: 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.3, 9.5, 9.6
 */

// Mock axios before requiring the service
jest.mock('axios');

// Mock grok config to enable service for testing
jest.mock('../config/grok.config', () => ({
  apiKey: 'test-api-key-with-sufficient-length-12345',
  model: 'grok-beta',
  timeout: 5000,
  enabled: true
}));

const axios = require('axios');

describe('Grok Service - processMessage', () => {
  let grokService;
  
  beforeEach(() => {
    // Clear module cache and mocks
    jest.clearAllMocks();
    
    // Require the service fresh for each test
    delete require.cache[require.resolve('../services/grok-service')];
    grokService = require('../services/grok-service');
  });
  
  describe('Task 2.2: processMessage implementation', () => {
    test('should build system prompt with medical assistant instructions', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'This is a test response from Grok API.'
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(mockResponse);
      
      await grokService.processMessage('I have a headache');
      
      // Verify axios was called
      expect(axios.post).toHaveBeenCalled();
      
      // Get the call arguments
      const callArgs = axios.post.mock.calls[0];
      const requestBody = callArgs[1];
      
      // Verify system prompt includes medical safety rules (Requirement 9.1, 9.3, 9.5)
      const systemMessage = requestBody.messages.find(m => m.role === 'system');
      
      expect(systemMessage).toBeDefined();
      expect(systemMessage.content).toContain('You are Ayurva');
      expect(systemMessage.content).toContain('NOT a doctor');
      expect(systemMessage.content).toContain('life-threatening');
      expect(systemMessage.content).toContain('Never prescribe specific medication dosages');
    });
    
    test('should format API request with correct parameters', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Test response'
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(mockResponse);
      
      const userMessage = 'What are symptoms of flu?';
      await grokService.processMessage(userMessage);
      
      // Verify request body format (Requirements 1.3, 1.4, 1.5, 1.6)
      const callArgs = axios.post.mock.calls[0];
      const requestBody = callArgs[1];
      
      expect(requestBody.model).toBe('grok-beta');
      expect(requestBody.temperature).toBe(0.7);
      expect(requestBody.max_tokens).toBe(2048);
      expect(requestBody.messages).toHaveLength(2);
      expect(requestBody.messages[0].role).toBe('system');
      expect(requestBody.messages[1].role).toBe('user');
      expect(requestBody.messages[1].content).toBe(userMessage);
    });
    
    test('should send HTTP POST request with correct headers', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Test response'
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(mockResponse);
      
      await grokService.processMessage('Test query');
      
      // Verify headers and timeout (Requirement 1.3)
      const callArgs = axios.post.mock.calls[0];
      const config = callArgs[2];
      
      expect(config.headers['Content-Type']).toBe('application/json');
      expect(config.headers['Authorization']).toBe('Bearer test-api-key-with-sufficient-length-12345');
      expect(config.timeout).toBe(5000);
    });
    
    test('should extract response content from API response', async () => {
      // Mock successful API response (Requirement 1.4)
      const mockApiResponse = 'This is the AI-generated medical advice.';
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: mockApiResponse
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(mockResponse);
      
      const response = await grokService.processMessage('I have a fever');
      
      // Verify response contains the API content
      expect(response).toContain(mockApiResponse);
    });
    
    test('should append medical disclaimer to all responses', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'You should rest and drink plenty of fluids.'
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(mockResponse);
      
      const response = await grokService.processMessage('I have a cold');
      
      // Verify medical disclaimer is appended (Requirements 9.2, 9.6)
      expect(response).toContain('Disclaimer: I am an AI assistant, not a doctor');
      expect(response).toContain('Consult a professional for critical health decisions');
      
      // Verify disclaimer is at the end
      expect(response).toMatch(/\*Disclaimer:.*\*$/);
    });
    
    test('should throw error on API failure', async () => {
      // Mock API error
      axios.post.mockRejectedValue(new Error('Network error'));
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API failed');
    });
    
    test('should log processing start and success', async () => {
      // Mock console.log
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      // Mock successful API response
      const mockResponse = {
        data: {
          choices: [
            {
              message: {
                content: 'Test response'
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(mockResponse);
      
      await grokService.processMessage('Test query');
      
      // Verify logging - console.log is called with multiple arguments
      const logCalls = consoleSpy.mock.calls.map(call => call.join(' '));
      expect(logCalls.some(call => call.includes('Grok API processing'))).toBe(true);
      expect(logCalls.some(call => call.includes('Grok API response generated successfully'))).toBe(true);
      
      consoleSpy.mockRestore();
    });
  });
  
  describe('Task 2.3: Error handling and timeout logic', () => {
    test('should handle 429 quota errors by throwing exception to trigger fallback', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock 429 quota error (Requirement 3.1)
      const quotaError = new Error('Quota exceeded');
      quotaError.response = {
        status: 429,
        data: { error: { message: 'Rate limit exceeded' } }
      };
      axios.post.mockRejectedValue(quotaError);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API quota exceeded - triggering fallback');
      
      // Verify error logging with structured data
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Quota exceeded (429)');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'quota_exceeded',
        status_code: 429
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle 401 authentication errors with logging', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock 401 authentication error (Requirement 3.3)
      const authError = new Error('Unauthorized');
      authError.response = {
        status: 401,
        data: { error: { message: 'Invalid API key' } }
      };
      axios.post.mockRejectedValue(authError);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API authentication failed - invalid API key');
      
      // Verify error logging with structured data
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Authentication failed (401)');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'authentication_error',
        status_code: 401
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should implement 5-second timeout for API requests', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock timeout error (Requirement 3.2)
      const timeoutError = new Error('timeout of 5000ms exceeded');
      timeoutError.code = 'ECONNABORTED';
      axios.post.mockRejectedValue(timeoutError);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API timeout after 5000ms - triggering fallback');
      
      // Verify error logging with timeout context
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Request timeout');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'timeout',
        timeout_ms: 5000
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle network errors (connection refused)', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock connection refused error (Requirement 3.4)
      const networkError = new Error('connect ECONNREFUSED');
      networkError.code = 'ECONNREFUSED';
      axios.post.mockRejectedValue(networkError);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API network error: ECONNREFUSED - triggering fallback');
      
      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Network error');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'network_error',
        error_code: 'ECONNREFUSED'
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle network errors (DNS failure)', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock DNS failure error (Requirement 3.4)
      const dnsError = new Error('getaddrinfo ENOTFOUND');
      dnsError.code = 'ENOTFOUND';
      axios.post.mockRejectedValue(dnsError);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API network error: ENOTFOUND - triggering fallback');
      
      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'network_error',
        error_code: 'ENOTFOUND'
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle malformed responses (missing choices)', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock malformed response (Requirement 3.4)
      const malformedResponse = {
        data: {
          // Missing choices array
        }
      };
      axios.post.mockResolvedValue(malformedResponse);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Malformed response from Grok API - missing required fields');
      
      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Malformed response');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'malformed_response'
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle empty response content', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock empty response (Requirement 3.4)
      const emptyResponse = {
        data: {
          choices: [
            {
              message: {
                content: ''
              }
            }
          ]
        }
      };
      axios.post.mockResolvedValue(emptyResponse);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Empty response from Grok API');
      
      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Empty response');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'empty_response'
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should handle 5xx server errors', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock 500 server error (Requirement 3.4)
      const serverError = new Error('Internal Server Error');
      serverError.response = {
        status: 500,
        data: { error: { message: 'Internal server error' } }
      };
      axios.post.mockRejectedValue(serverError);
      
      await expect(grokService.processMessage('Test query'))
        .rejects
        .toThrow('Grok API server error (500) - triggering fallback');
      
      // Verify error logging
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      expect(errorLog[0]).toContain('Server error (500)');
      expect(errorLog[1]).toMatchObject({
        service: 'grok',
        error_type: 'server_error',
        status_code: 500
      });
      
      consoleErrorSpy.mockRestore();
    });
    
    test('should log all errors with timestamp, error type, and user message context', async () => {
      // Mock console.error
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      // Mock generic error (Requirements 3.5, 3.6)
      const genericError = new Error('Something went wrong');
      axios.post.mockRejectedValue(genericError);
      
      const userMessage = 'I have a headache';
      await expect(grokService.processMessage(userMessage))
        .rejects
        .toThrow();
      
      // Verify structured error logging
      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorLog = consoleErrorSpy.mock.calls[0];
      
      // Verify timestamp in log message
      expect(errorLog[0]).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/);
      
      // Verify structured log data
      expect(errorLog[1]).toMatchObject({
        timestamp: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/),
        service: 'grok',
        error_type: 'unexpected_error',
        error_message: 'Something went wrong',
        user_message: userMessage,
        stack_trace: expect.any(String)
      });
      
      consoleErrorSpy.mockRestore();
    });
  });
});
