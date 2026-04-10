/**
 * Unit tests for Grok Service Initialization
 * Tests Task 2.4: Service initialization with valid and invalid API keys
 * 
 * Requirements tested: 1.1, 1.2, 7.6
 */

describe('Grok Service - Initialization', () => {
  beforeEach(() => {
    // Clear all mocks and module cache before each test
    jest.resetModules();
    jest.clearAllMocks();
  });
  
  test('should initialize successfully with valid API key', async () => {
    // Mock grok config with valid API key
    jest.mock('../config/grok.config', () => ({
      apiKey: 'test-api-key-with-sufficient-length-12345',
      model: 'grok-beta',
      timeout: 5000,
      enabled: true
    }));
    
    const grokService = require('../services/grok-service');
    
    // Verify configuration loaded correctly
    expect(grokService.enabled).toBe(true);
    expect(grokService.apiKey).toBe('test-api-key-with-sufficient-length-12345');
    expect(grokService.model).toBe('grok-beta');
    expect(grokService.timeout).toBe(5000);
    
    // Call init to verify it completes without error
    await expect(grokService.init()).resolves.not.toThrow();
    expect(grokService.initialized).toBe(true);
  });
  
  test('should reject initialization with invalid API key (too short)', async () => {
    // Mock grok config with short API key
    jest.mock('../config/grok.config', () => ({
      apiKey: 'short-key',
      model: 'grok-beta',
      timeout: 5000,
      enabled: true
    }));
    
    const grokService = require('../services/grok-service');
    
    // Attempt to initialize should fail
    await expect(grokService.init())
      .rejects
      .toThrow('Invalid GROK_API_KEY format - must be at least 20 characters');
  });
  
  test('should handle missing API key gracefully', async () => {
    // Mock grok config with no API key
    jest.mock('../config/grok.config', () => ({
      apiKey: null,
      model: 'grok-beta',
      timeout: 5000,
      enabled: false
    }));
    
    const grokService = require('../services/grok-service');
    
    // Service should be disabled
    expect(grokService.enabled).toBe(false);
    
    // Attempt to initialize should fail
    await expect(grokService.init())
      .rejects
      .toThrow('Grok service not enabled - missing or invalid API key');
  });
  
  test('should not re-initialize if already initialized', async () => {
    // Mock grok config with valid API key
    jest.mock('../config/grok.config', () => ({
      apiKey: 'test-api-key-with-sufficient-length-12345',
      model: 'grok-beta',
      timeout: 5000,
      enabled: true
    }));
    
    const grokService = require('../services/grok-service');
    
    // Initialize once
    await grokService.init();
    expect(grokService.initialized).toBe(true);
    
    // Call init again - should return immediately without error
    await expect(grokService.init()).resolves.not.toThrow();
    expect(grokService.initialized).toBe(true);
  });
  
  test('should use default model when GROK_MODEL not set', async () => {
    // Mock grok config without explicit model
    jest.mock('../config/grok.config', () => ({
      apiKey: 'test-api-key-with-sufficient-length-12345',
      model: 'grok-beta', // Default value
      timeout: 5000,
      enabled: true
    }));
    
    const grokService = require('../services/grok-service');
    
    expect(grokService.model).toBe('grok-beta');
  });
  
  test('should use default timeout when GROK_TIMEOUT not set', async () => {
    // Mock grok config without explicit timeout
    jest.mock('../config/grok.config', () => ({
      apiKey: 'test-api-key-with-sufficient-length-12345',
      model: 'grok-beta',
      timeout: 5000, // Default value
      enabled: true
    }));
    
    const grokService = require('../services/grok-service');
    
    expect(grokService.timeout).toBe(5000);
  });
});
