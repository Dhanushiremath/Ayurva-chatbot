/**
 * Unit tests for Grok API configuration
 * 
 * Tests configuration loading, validation, and default values
 */

describe('Grok Configuration', () => {
  let originalEnv;

  beforeEach(() => {
    // Save original environment variables
    originalEnv = { ...process.env };
    
    // Clear Grok-related environment variables
    delete process.env.GROK_API_KEY;
    delete process.env.GROK_MODEL;
    delete process.env.GROK_TIMEOUT;
    
    // Clear module cache to reload config with new env vars
    jest.resetModules();
  });

  afterEach(() => {
    // Restore original environment variables
    process.env = originalEnv;
  });

  test('Valid GROK_API_KEY loads successfully', () => {
    process.env.GROK_API_KEY = 'valid_api_key_with_more_than_20_characters';
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.apiKey).toBe('valid_api_key_with_more_than_20_characters');
    expect(grokConfig.enabled).toBe(true);
  });

  test('Missing GROK_API_KEY logs warning and disables service', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.apiKey).toBeUndefined();
    expect(grokConfig.enabled).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('GROK_API_KEY not set')
    );
    
    consoleWarnSpy.mockRestore();
  });

  test('GROK_MODEL defaults to "grok-beta" when not set', () => {
    process.env.GROK_API_KEY = 'valid_api_key_with_more_than_20_characters';
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.model).toBe('grok-beta');
  });

  test('GROK_TIMEOUT defaults to 5000ms when not set', () => {
    process.env.GROK_API_KEY = 'valid_api_key_with_more_than_20_characters';
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.timeout).toBe(5000);
  });

  test('Custom GROK_MODEL value is respected', () => {
    process.env.GROK_API_KEY = 'valid_api_key_with_more_than_20_characters';
    process.env.GROK_MODEL = 'grok-2';
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.model).toBe('grok-2');
  });

  test('Custom GROK_TIMEOUT value is respected', () => {
    process.env.GROK_API_KEY = 'valid_api_key_with_more_than_20_characters';
    process.env.GROK_TIMEOUT = '10000';
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.timeout).toBe(10000);
  });

  test('API key shorter than 20 characters is rejected', () => {
    process.env.GROK_API_KEY = 'short_key';
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.apiKey).toBeNull();
    expect(grokConfig.enabled).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('too short')
    );
    
    consoleWarnSpy.mockRestore();
  });

  test('API key with exactly 20 characters is accepted', () => {
    process.env.GROK_API_KEY = '12345678901234567890'; // exactly 20 chars
    
    const grokConfig = require('../config/grok.config');
    
    expect(grokConfig.apiKey).toBe('12345678901234567890');
    expect(grokConfig.enabled).toBe(true);
  });

  test('Configuration logs success message when API key is valid', () => {
    process.env.GROK_API_KEY = 'valid_api_key_with_more_than_20_characters';
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    
    require('../config/grok.config');
    
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('configured successfully')
    );
    
    consoleLogSpy.mockRestore();
  });
});
