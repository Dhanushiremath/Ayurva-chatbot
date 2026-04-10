const axios = require('axios');
const grokConfig = require('../config/grok.config');

/**
 * Grok Service
 * 
 * Provides intelligent AI responses using xAI's Grok API as a fallback tier
 * when the primary Gemini service fails. This service maintains medical safety
 * standards and includes appropriate disclaimers in all responses.
 * 
 * Requirements: 1.1, 1.2, 7.1, 7.3, 7.4, 7.6
 */
class GrokService {
  constructor() {
    // Load configuration from environment variables via grok.config.js
    this.apiKey = grokConfig.apiKey;
    this.model = grokConfig.model;
    this.timeout = grokConfig.timeout;
    this.enabled = grokConfig.enabled;
    
    // API endpoint for Grok (OpenAI-compatible)
    this.apiUrl = 'https://api.x.ai/v1/chat/completions';
    
    // Lazy initialization flag
    this.initialized = false;
    
    // Log initialization status
    if (!this.enabled) {
      console.warn('[Grok Service] Service disabled - GROK_API_KEY not configured or invalid');
    } else {
      console.log('[Grok Service] Service configured and ready for lazy initialization');
      console.log(`[Grok Service] Model: ${this.model}, Timeout: ${this.timeout}ms`);
    }
  }

  /**
   * Initialize the Grok service with API key validation
   * Called lazily on first use
   * 
   * Requirements: 1.2, 7.6
   */
  async init() {
    if (this.initialized) return;
    
    if (!this.enabled || !this.apiKey) {
      throw new Error('Grok service not enabled - missing or invalid API key');
    }
    
    // Validate API key format (minimum 20 characters)
    if (this.apiKey.length < 20) {
      throw new Error('Invalid GROK_API_KEY format - must be at least 20 characters');
    }
    
    this.initialized = true;
    console.log('✅ Grok Service initialized successfully');
  }

  /**
   * Process user message through Grok API
   * 
   * Requirements: 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.3, 9.5, 9.6
   * 
   * @param {string} input - User message
   * @returns {Promise<string>} - AI response with medical disclaimer
   */
  async processMessage(input) {
    // Ensure service is initialized
    if (!this.initialized) {
      await this.init();
    }
    
    console.log('🤖 Grok API processing:', input);
    
    // Build system prompt with medical assistant instructions and safety rules
    // Requirements: 9.1, 9.3, 9.5
    const systemPrompt = `You are Ayurva, an advanced AI healthcare assistant. 
      Your goal is to provide helpful, empathetic, and medically-grounded information.
      
      CRITICAL RULES:
      1. You are NOT a doctor. Always include a disclaimer that this is for informational purposes.
      2. If symptoms sound life-threatening (chest pain, severe bleeding, difficulty breathing), advisor emergency services immediately.
      3. Never prescribe specific medication dosages.`;
    
    // Format API request with model, messages, temperature, and max_tokens
    // Requirements: 1.3, 1.4, 1.5, 1.6
    const requestBody = {
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ],
      temperature: 0.7,
      max_tokens: 2048
    };
    
    try {
      // Send HTTP POST request to Grok API with timeout
      // Requirements: 1.3, 3.2
      const response = await axios.post(
        this.apiUrl,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: this.timeout // 5-second timeout (Requirement 3.2)
        }
      );
      
      // Validate response structure (Requirement 3.4)
      if (!response.data || !response.data.choices || !response.data.choices[0] || !response.data.choices[0].message) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [Grok Service] Malformed response - missing required fields`, {
          timestamp,
          service: 'grok',
          error_type: 'malformed_response',
          user_message: input
        });
        throw new Error('Malformed response from Grok API - missing required fields');
      }
      
      // Extract response content from API response
      // Requirement: 1.4
      const aiResponse = response.data.choices[0].message.content;
      
      // Validate response content is not empty (Requirement 3.4)
      if (!aiResponse || aiResponse.trim().length === 0) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] [Grok Service] Empty response from API`, {
          timestamp,
          service: 'grok',
          error_type: 'empty_response',
          user_message: input
        });
        throw new Error('Empty response from Grok API');
      }
      
      // Append medical disclaimer to all responses
      // Requirements: 9.2, 9.6
      const disclaimer = "\n\n*Disclaimer: I am an AI assistant, not a doctor. Consult a professional for critical health decisions.*";
      
      console.log('✅ Grok API response generated successfully');
      
      return aiResponse + disclaimer;
    } catch (error) {
      const timestamp = new Date().toISOString();
      
      // Handle 429 quota errors by throwing exception to trigger fallback
      // Requirement: 3.1
      if (error.response && error.response.status === 429) {
        console.error(`[${timestamp}] [Grok Service] Quota exceeded (429)`, {
          timestamp,
          service: 'grok',
          error_type: 'quota_exceeded',
          error_message: 'API quota limit reached',
          user_message: input,
          status_code: 429
        });
        throw new Error('Grok API quota exceeded - triggering fallback');
      }
      
      // Handle 401 authentication errors with logging
      // Requirement: 3.3
      if (error.response && error.response.status === 401) {
        console.error(`[${timestamp}] [Grok Service] Authentication failed (401)`, {
          timestamp,
          service: 'grok',
          error_type: 'authentication_error',
          error_message: 'Invalid API key or unauthorized access',
          user_message: input,
          status_code: 401
        });
        throw new Error('Grok API authentication failed - invalid API key');
      }
      
      // Handle network timeout errors
      // Requirement: 3.2
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        console.error(`[${timestamp}] [Grok Service] Request timeout`, {
          timestamp,
          service: 'grok',
          error_type: 'timeout',
          error_message: `Request exceeded ${this.timeout}ms timeout`,
          user_message: input,
          timeout_ms: this.timeout
        });
        throw new Error(`Grok API timeout after ${this.timeout}ms - triggering fallback`);
      }
      
      // Handle other network errors (connection refused, DNS failure, etc.)
      // Requirement: 3.4
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ENETUNREACH') {
        console.error(`[${timestamp}] [Grok Service] Network error`, {
          timestamp,
          service: 'grok',
          error_type: 'network_error',
          error_message: error.message,
          error_code: error.code,
          user_message: input
        });
        throw new Error(`Grok API network error: ${error.code} - triggering fallback`);
      }
      
      // Handle other API errors (5xx server errors, etc.)
      // Requirement: 3.4
      if (error.response && error.response.status >= 500) {
        console.error(`[${timestamp}] [Grok Service] Server error (${error.response.status})`, {
          timestamp,
          service: 'grok',
          error_type: 'server_error',
          error_message: error.response.data?.error?.message || 'Internal server error',
          user_message: input,
          status_code: error.response.status
        });
        throw new Error(`Grok API server error (${error.response.status}) - triggering fallback`);
      }
      
      // Log all other errors with full context
      // Requirements: 3.5, 3.6
      console.error(`[${timestamp}] [Grok Service] Unexpected error`, {
        timestamp,
        service: 'grok',
        error_type: 'unexpected_error',
        error_message: error.message,
        user_message: input,
        stack_trace: error.stack
      });
      
      throw new Error(`Grok API failed: ${error.message}`);
    }
  }
}

// Export singleton instance
module.exports = new GrokService();
