# Implementation Plan: Grok API Fallback Integration

## Overview

This implementation plan breaks down the integration of xAI's Grok API as an intelligent fallback tier in the Ayurva medical chatbot system. The implementation will enhance the existing 3-tier fallback chain (Gemini → Rasa → Local NLP) to a 4-tier chain (Gemini → Grok → Rasa → Local NLP), improving system reliability and maintaining intelligent AI responses during Gemini outages.

## Tasks

- [x] 1. Set up Grok service configuration and environment variables
  - Add GROK_API_KEY, GROK_MODEL, and GROK_TIMEOUT to .env.example
  - Update backend configuration to load Grok environment variables
  - Validate API key format (minimum 20 characters)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6_

- [ ] 2. Implement Grok service module
  - [x] 2.1 Create GrokService class with initialization and configuration
    - Create `backend/services/grok-service.js`
    - Implement constructor to load configuration from environment variables
    - Implement lazy initialization with API key validation
    - Set default values for GROK_MODEL ("grok-beta") and GROK_TIMEOUT (5000ms)
    - _Requirements: 1.1, 1.2, 7.1, 7.3, 7.4, 7.6_

  - [x] 2.2 Implement processMessage method with medical context
    - Build system prompt with medical assistant instructions and safety rules
    - Format API request with model, messages, temperature (0.7), and max_tokens (2048)
    - Send HTTP POST request to https://api.x.ai/v1/chat/completions
    - Extract response content from API response
    - Append medical disclaimer to all responses
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.3, 9.5, 9.6_

  - [x] 2.3 Implement error handling and timeout logic
    - Handle 429 quota errors by throwing exception to trigger fallback
    - Handle 401 authentication errors with logging
    - Implement 5-second timeout for API requests
    - Handle network errors and malformed responses
    - Log all errors with timestamp, error type, and user message context
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 2.4 Write unit tests for Grok service
    - Test service initialization with valid and invalid API keys
    - Test successful message processing with disclaimer
    - Test quota error (429) throws exception
    - Test timeout error throws exception
    - Test malformed response handling
    - Test medical disclaimer appended to responses
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 3.1, 3.2, 9.2_

- [ ] 3. Checkpoint - Verify Grok service works in isolation
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Integrate Grok into fallback chain for WhatsApp webhook
  - [x] 4.1 Update WhatsApp webhook route handler
    - Open `backend/routes/whatsappWebhook.js`
    - Import grokService module
    - Add Grok fallback tier between Gemini and Rasa in try-catch chain
    - Log service selection and fallback triggers
    - Include service name in response metadata
    - _Requirements: 2.1, 2.4, 4.1, 4.2, 4.4, 4.5_

  - [x] 4.2 Handle WhatsApp-specific response formatting
    - Truncate responses exceeding 1500 characters
    - Append web interface link for truncated responses
    - Send response via Twilio WhatsApp API
    - _Requirements: 4.3_

  - [x] 4.3 Write integration tests for WhatsApp fallback chain
    - Test Gemini failure triggers Grok attempt
    - Test Grok success returns response via WhatsApp
    - Test response truncation for long messages
    - Test service metadata included in response
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 5. Integrate Grok into fallback chain for web chat
  - [x] 5.1 Update web chat route handler
    - Open `backend/routes/chatRoutes.js`
    - Import grokService module
    - Add Grok fallback tier between Gemini and Rasa in try-catch chain
    - Log service selection and fallback triggers
    - _Requirements: 2.1, 5.1_

  - [x] 5.2 Format JSON responses with service metadata
    - Include "service" field indicating which service processed the message
    - Include "cached" boolean field for cache hit/miss
    - Return HTTP 200 for all successfully processed messages
    - _Requirements: 5.2, 5.3, 5.4, 5.5_

  - [x] 5.3 Write integration tests for web chat fallback chain
    - Test Gemini failure triggers Grok attempt
    - Test Grok success returns JSON response
    - Test service field correctly identifies Grok
    - Test HTTP 200 returned for successful processing
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

- [ ] 6. Checkpoint - Verify fallback chain works end-to-end
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement response caching for Grok responses
  - [x] 7.1 Update cache service integration
    - Verify cache service caches Grok responses identically to Gemini
    - Ensure cache check occurs before fallback chain invocation
    - Include cache metadata (hit/miss) in all responses
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [x] 7.2 Optimize cache performance
    - Verify cached responses return within 50 milliseconds
    - Test cache key normalization for consistent lookups
    - _Requirements: 6.5_

  - [x] 7.3 Write unit tests for cache integration
    - Test cache hit returns immediately without invoking services
    - Test cache miss invokes fallback chain
    - Test Grok responses are cached correctly
    - Test cache metadata included in responses
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 8. Implement logging and monitoring
  - [x] 8.1 Add structured logging for Grok service
    - Log "Attempting Grok API processing" when Grok is invoked
    - Log "Response via grok sent successfully" with response length on success
    - Log "Grok failed, falling back to Rasa" with error message on failure
    - Include timestamps with millisecond precision in all logs
    - _Requirements: 8.1, 8.2, 8.3, 8.6_

  - [x] 8.2 Add performance logging
    - Log response time for each service in the fallback chain
    - Log complete fallback chain execution path for each message
    - _Requirements: 8.4, 8.5_

  - [x] 8.3 Write tests for logging behavior
    - Test log entries created for Grok invocation
    - Test log entries created for Grok success
    - Test log entries created for Grok failure
    - Test timestamps included in all logs
    - _Requirements: 8.1, 8.2, 8.3, 8.6_

- [ ] 9. Implement performance optimizations
  - [x] 9.1 Optimize fallback chain timing
    - Ensure Grok invoked within 100ms of Gemini failure
    - Verify 5-second timeout for Grok API requests
    - Ensure complete fallback chain completes within 10 seconds
    - _Requirements: 10.1, 10.2, 10.3_

  - [x] 9.2 Test concurrent request handling
    - Verify system handles 10 concurrent messages without degradation
    - Test cache performance under concurrent load
    - _Requirements: 10.5_

  - [x] 9.3 Write performance tests
    - Test Grok invocation timing after Gemini failure
    - Test timeout enforcement for Grok API
    - Test complete fallback chain timing
    - Test concurrent request handling
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [ ] 10. Final integration and validation
  - [x] 10.1 Verify medical context preservation
    - Test system prompt includes medical safety rules
    - Test medical disclaimer appended to all Grok responses
    - Test emergency symptom handling recommendations
    - Test medication dosage prescription prevention
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [x] 10.2 Verify graceful degradation
    - Test system continues functioning when GROK_API_KEY not set
    - Test fallback chain skips Grok when service not initialized
    - Test complete chain failure returns default welcome message
    - _Requirements: 7.2, 7.5_

  - [x] 10.3 Write end-to-end integration tests
    - Test complete fallback chain with all services
    - Test graceful degradation scenarios
    - Test medical context preservation across all services
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 2.6, 9.1, 9.2, 9.3_

- [ ] 11. Final checkpoint - Complete system validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- The implementation uses JavaScript/Node.js with existing dependencies (axios, node-cache, express)
- No new dependencies required - Grok API uses standard HTTP REST calls
- Medical safety rules and disclaimers must match existing Gemini service implementation
- All error handling must throw exceptions to trigger fallback chain progression
