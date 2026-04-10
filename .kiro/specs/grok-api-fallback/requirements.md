# Requirements Document: Grok API Fallback Integration

## Introduction

This document specifies requirements for integrating Grok API as an intelligent fallback mechanism in the Ayurva medical chatbot system. The current system experiences slowness and unresponsiveness when the primary Gemini API fails or exceeds quota limits. This feature adds Grok API as a secondary AI-powered fallback tier between Gemini and the existing Rasa/NLP fallbacks, improving system reliability and response quality.

## Glossary

- **Chatbot_System**: The Ayurva medical chatbot backend service that processes user health queries
- **Gemini_Service**: The primary AI service using Google Gemini API for intelligent medical responses
- **Grok_Service**: The new secondary AI service using Grok API as an intelligent fallback
- **Rasa_Service**: The tertiary fallback service using Rasa NLP for structured intent-based responses
- **Local_NLP_Service**: The final fallback service using keyword-based pattern matching
- **Fallback_Chain**: The sequential attempt of services (Gemini → Grok → Rasa → Local NLP)
- **API_Failure**: Any error condition including quota exceeded, timeout, network error, or service unavailable
- **Response_Time**: The duration from receiving a user message to sending a response
- **User_Message**: A health-related query from a user via WhatsApp or web interface
- **AI_Response**: A generated response from Gemini or Grok services
- **Quota_Error**: An error indicating API rate limit or quota has been exceeded

## Requirements

### Requirement 1: Grok API Service Integration

**User Story:** As a system administrator, I want to integrate Grok API into the chatbot backend, so that the system has an additional intelligent AI fallback option.

#### Acceptance Criteria

1. THE Chatbot_System SHALL support configuration of Grok API credentials via environment variables
2. THE Grok_Service SHALL initialize with API key, model name, and timeout settings from environment configuration
3. WHEN the Grok_Service receives a User_Message, THE Grok_Service SHALL send the message to Grok API with appropriate medical context
4. WHEN Grok API returns a response, THE Grok_Service SHALL format the response with a medical disclaimer
5. THE Grok_Service SHALL enforce a maximum response length of 2048 tokens per request
6. THE Grok_Service SHALL include temperature setting of 0.7 for balanced creativity and accuracy

### Requirement 2: Enhanced Fallback Chain Logic

**User Story:** As a developer, I want Grok API positioned as the second fallback tier, so that users receive intelligent AI responses even when Gemini fails.

#### Acceptance Criteria

1. WHEN Gemini_Service fails with an API_Failure, THE Chatbot_System SHALL attempt to process the User_Message with Grok_Service
2. WHEN Grok_Service fails with an API_Failure, THE Chatbot_System SHALL attempt to process the User_Message with Rasa_Service
3. WHEN Rasa_Service fails, THE Chatbot_System SHALL attempt to process the User_Message with Local_NLP_Service
4. THE Chatbot_System SHALL log which service successfully processed each User_Message
5. THE Chatbot_System SHALL complete the Fallback_Chain within 10 seconds for any User_Message
6. FOR ALL User_Messages, THE Chatbot_System SHALL return exactly one response using the first successful service in the Fallback_Chain

### Requirement 3: Quota and Error Handling

**User Story:** As a system operator, I want proper error detection and handling for Grok API, so that quota errors trigger the next fallback tier seamlessly.

#### Acceptance Criteria

1. WHEN Grok_Service receives a Quota_Error from Grok API, THE Grok_Service SHALL throw an error to trigger the next fallback
2. WHEN Grok_Service encounters a network timeout, THE Grok_Service SHALL throw an error within 5 seconds
3. WHEN Grok_Service receives an invalid API key error, THE Grok_Service SHALL log the error and throw an exception
4. IF Grok API returns an error response, THEN THE Grok_Service SHALL extract the error message and include it in the thrown exception
5. THE Grok_Service SHALL NOT return a default message on API failure (must throw error to trigger fallback)
6. THE Chatbot_System SHALL log all Grok_Service errors with timestamp, error type, and User_Message context

### Requirement 4: WhatsApp Integration

**User Story:** As a WhatsApp user, I want to receive responses from Grok when Gemini is unavailable, so that I always get intelligent medical advice.

#### Acceptance Criteria

1. WHEN a User_Message arrives via WhatsApp webhook, THE Chatbot_System SHALL attempt the Fallback_Chain starting with Gemini_Service
2. WHEN Grok_Service successfully processes a WhatsApp User_Message, THE Chatbot_System SHALL send the AI_Response via Twilio WhatsApp API
3. IF the AI_Response exceeds 1500 characters, THEN THE Chatbot_System SHALL truncate the response and append a link to the web interface
4. THE Chatbot_System SHALL include the service name (gemini, grok, rasa, or local-nlp) in the response metadata
5. THE Chatbot_System SHALL process WhatsApp messages through the complete Fallback_Chain without user-visible errors

### Requirement 5: Web Chat Integration

**User Story:** As a web application user, I want to receive responses from Grok when Gemini is unavailable, so that the chatbot remains responsive.

#### Acceptance Criteria

1. WHEN a User_Message arrives via the web chat API endpoint, THE Chatbot_System SHALL attempt the Fallback_Chain starting with Gemini_Service
2. WHEN Grok_Service successfully processes a web User_Message, THE Chatbot_System SHALL return the AI_Response in JSON format
3. THE Chatbot_System SHALL include a "service" field in the JSON response indicating which service processed the message
4. THE Chatbot_System SHALL include a "cached" boolean field indicating whether the response came from cache
5. THE Chatbot_System SHALL return HTTP 200 status for all successfully processed messages regardless of which fallback tier succeeded

### Requirement 6: Response Caching

**User Story:** As a system operator, I want Grok responses cached like Gemini responses, so that repeated queries are answered instantly without API calls.

#### Acceptance Criteria

1. WHEN Grok_Service successfully generates an AI_Response, THE Chatbot_System SHALL cache the response with the User_Message as the key
2. WHEN a cached User_Message is received, THE Chatbot_System SHALL return the cached response without invoking any service in the Fallback_Chain
3. THE Chatbot_System SHALL include cache metadata in responses indicating cache hit or miss
4. THE Cache_Service SHALL store responses from all services (gemini, grok, rasa, local-nlp) with identical caching logic
5. WHEN cache contains a response for a User_Message, THE Chatbot_System SHALL return the cached response within 50 milliseconds

### Requirement 7: Configuration Management

**User Story:** As a developer, I want Grok API configuration managed through environment variables, so that credentials are secure and deployment is flexible.

#### Acceptance Criteria

1. THE Chatbot_System SHALL read Grok API key from the GROK_API_KEY environment variable
2. WHERE GROK_API_KEY is not set, THE Grok_Service SHALL log a warning and skip initialization
3. THE Chatbot_System SHALL support optional GROK_MODEL environment variable with default value "grok-beta"
4. THE Chatbot_System SHALL support optional GROK_TIMEOUT environment variable with default value 5000 milliseconds
5. WHERE Grok_Service is not initialized, THE Chatbot_System SHALL skip Grok in the Fallback_Chain and proceed to Rasa_Service
6. THE Chatbot_System SHALL validate that GROK_API_KEY is at least 20 characters long when provided

### Requirement 8: Logging and Monitoring

**User Story:** As a system operator, I want detailed logging of Grok API usage, so that I can monitor performance and troubleshoot issues.

#### Acceptance Criteria

1. WHEN Grok_Service is invoked, THE Chatbot_System SHALL log "Attempting Grok API processing" with the User_Message
2. WHEN Grok_Service succeeds, THE Chatbot_System SHALL log "Response via grok sent successfully" with response length
3. WHEN Grok_Service fails, THE Chatbot_System SHALL log "Grok failed, falling back to Rasa" with the error message
4. THE Chatbot_System SHALL log Response_Time for each service in the Fallback_Chain
5. THE Chatbot_System SHALL log the complete Fallback_Chain execution path for each User_Message
6. THE Chatbot_System SHALL include timestamps in all log entries with millisecond precision

### Requirement 9: Medical Context Preservation

**User Story:** As a medical chatbot user, I want Grok responses to maintain medical accuracy and safety, so that I receive reliable health information.

#### Acceptance Criteria

1. WHEN Grok_Service processes a User_Message, THE Grok_Service SHALL include a system prompt defining medical assistant behavior
2. THE Grok_Service SHALL append a medical disclaimer to all AI_Responses stating "I am an AI assistant, not a doctor"
3. THE Grok_Service SHALL use the same medical context and safety rules as Gemini_Service
4. THE Grok_Service SHALL instruct Grok API to recommend emergency services for life-threatening symptoms
5. THE Grok_Service SHALL instruct Grok API to never prescribe specific medication dosages
6. FOR ALL AI_Responses from Grok_Service, THE response SHALL maintain empathetic and helpful tone consistent with Gemini responses

### Requirement 10: Performance Requirements

**User Story:** As a user, I want fast responses from the chatbot, so that I can get health information quickly during emergencies.

#### Acceptance Criteria

1. WHEN Gemini_Service fails, THE Chatbot_System SHALL invoke Grok_Service within 100 milliseconds
2. THE Grok_Service SHALL timeout and trigger Rasa fallback if Grok API does not respond within 5 seconds
3. THE Chatbot_System SHALL complete the entire Fallback_Chain within 10 seconds for any User_Message
4. WHEN cache contains a response, THE Chatbot_System SHALL return the response within 50 milliseconds
5. THE Chatbot_System SHALL process at least 10 concurrent User_Messages without degradation in Response_Time
