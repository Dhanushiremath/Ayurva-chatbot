/**
 * Grok API Configuration
 * 
 * This module loads and validates Grok API configuration from environment variables.
 * The Grok service uses xAI's Grok API as an intelligent fallback tier for the chatbot.
 */

/**
 * Load Grok configuration from environment variables
 * @returns {Object} Grok configuration object
 */
const loadGrokConfig = () => {
  const config = {
    apiKey: process.env.GROK_API_KEY,
    model: process.env.GROK_MODEL || 'grok-beta',
    timeout: parseInt(process.env.GROK_TIMEOUT || '5000', 10),
    enabled: false
  };

  // Validate API key if provided
  if (config.apiKey) {
    if (config.apiKey.length < 20) {
      console.warn('[Grok Config] GROK_API_KEY is too short (minimum 20 characters). Grok service will be disabled.');
      config.apiKey = null;
    } else {
      config.enabled = true;
      console.log('[Grok Config] Grok API configured successfully');
      console.log(`[Grok Config] Model: ${config.model}, Timeout: ${config.timeout}ms`);
    }
  } else {
    console.warn('[Grok Config] GROK_API_KEY not set. Grok service will be disabled.');
  }

  return config;
};

// Load configuration on module import
const grokConfig = loadGrokConfig();

module.exports = grokConfig;
