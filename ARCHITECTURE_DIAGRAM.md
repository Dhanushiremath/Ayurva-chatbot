# Ayurva - Architecture & Tech Stack Diagrams

## 1. High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACES                          │
├──────────────────────────┬──────────────────────────────────────┤
│   WhatsApp Messages      │      Web Browser (Desktop/Mobile)    │
└──────────┬───────────────┴────────────────┬─────────────────────┘
           │                                 │
           │                                 │
┌──────────▼─────────────────────────────────▼─────────────────────┐
│                    FRONTEND LAYER (Vercel)                       │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  React + Vite                                              │  │
│  │  • Chatbot Tab (ChatInterface)                             │  │
│  │  • Location Tab (Google Maps)                              │  │
│  │  • Health Insights Tab (Dashboard)                         │  │
│  │  • i18next (6 Languages)                                   │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬──────────────────────────────────┘
                                │ HTTPS/REST API
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                   BACKEND LAYER (Render)                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Express.js Server                                         │  │
│  │  • Authentication Middleware (Firebase + JWT)              │  │
│  │  • WhatsApp Webhook (Twilio)                               │  │
│  │  • Chat API Routes                                         │  │
│  │  • Hospital/Disease/Vaccination APIs                       │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  AI PROCESSING PIPELINE (3-Tier Fallback)                 │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │ Tier 1: LangChain + Google Gemini + RAG     │         │  │
│  │  │  • Vector Search (HNSWLib)                   │         │  │
│  │  │  • Medical Knowledge Base                    │         │  │
│  │  │  • Google Embeddings                         │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │                      ↓ (if fails)                          │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │ Tier 2: Rasa NLP                             │         │  │
│  │  │  • Intent Classification                     │         │  │
│  │  │  • Entity Extraction                         │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  │                      ↓ (if fails)                          │  │
│  │  ┌──────────────────────────────────────────────┐         │  │
│  │  │ Tier 3: Local NLP                            │         │  │
│  │  │  • Pattern Matching                          │         │  │
│  │  │  • Rule-based Responses                      │         │  │
│  │  └──────────────────────────────────────────────┘         │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────────────┬──────────────────────────────────┘
                                │
┌───────────────────────────────▼──────────────────────────────────┐
│                    DATABASE LAYER                                │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  MongoDB Atlas   │  │  Firebase Auth   │  │  Vector Store  │ │
│  │  • Users         │  │  • User Tokens   │  │  • HNSWLib     │ │
│  │  • Conversations │  │  • Sessions      │  │  • Embeddings  │ │
│  │  • Diseases      │  │                  │  │  • Medical KB  │ │
│  │  • Vaccinations  │  │                  │  │                │ │
│  └──────────────────┘  └──────────────────┘  └────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 2. Technology Stack by Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                │
├─────────────────────────────────────────────────────────────────┤
│  Framework:        React 18                                     │
│  Build Tool:       Vite                                         │
│  Routing:          React Router v6                              │
│  State:            React Hooks (useState, useEffect, useContext)│
│  HTTP Client:      Axios                                        │
│  Styling:          CSS3 + Responsive Design                     │
│  i18n:             i18next (EN, HI, TA, TE, BN, MR, KN)        │
│  Maps:             Google Maps JavaScript API                   │
│  Hosting:          Vercel (Global CDN)                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                 │
├─────────────────────────────────────────────────────────────────┤
│  Runtime:          Node.js v18+                                 │
│  Framework:        Express.js                                   │
│  Authentication:   Firebase Admin SDK + JWT                     │
│  Messaging:        Twilio WhatsApp Business API                 │
│  AI Framework:     LangChain.js                                 │
│  AI Model:         Google Gemini Pro                            │
│  NLP Fallback:     Rasa Open Source                             │
│  Vector DB:        HNSWLib (In-memory)                          │
│  Embeddings:       Google Generative AI Embeddings              │
│  ODM:              Mongoose                                     │
│  Security:         Helmet, CORS, express-validator              │
│  Hosting:          Render (Auto-scaling)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│  Primary DB:       MongoDB Atlas (Cloud)                        │
│  Collections:      Users, Conversations, Diseases, Vaccinations │
│  Auth Provider:    Firebase Authentication                      │
│  Vector Store:     HNSWLib (Medical Knowledge Embeddings)       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                            │
├─────────────────────────────────────────────────────────────────┤
│  AI:               Google Gemini API                            │
│  Messaging:        Twilio WhatsApp API                          │
│  Maps:             Google Maps Platform                         │
│  Auth:             Firebase                                     │
└─────────────────────────────────────────────────────────────────┘
```

## 3. RAG (Retrieval-Augmented Generation) Flow

```
User Query: "I have fever and cough"
           │
           ▼
┌──────────────────────────────────────┐
│  1. Query Embedding                  │
│  Convert text → vector [0.23, ...]   │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  2. Vector Similarity Search         │
│  Search HNSWLib for similar cases    │
│  Returns top 5 relevant documents    │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  3. Context Retrieved                │
│  • Fever symptoms guide              │
│  • Cough treatment protocols         │
│  • When to see a doctor              │
│  • Home remedies                     │
│  • Red flag symptoms                 │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  4. Prompt Construction              │
│  System: "You are a medical AI..."   │
│  Context: [Retrieved documents]      │
│  User Query: "I have fever..."       │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  5. Google Gemini Processing         │
│  Generates contextual response       │
└──────────┬───────────────────────────┘
           │
           ▼
┌──────────────────────────────────────┐
│  6. Response Validation              │
│  • Check length (1500 char limit)    │
│  • Emergency detection               │
│  • Safety checks                     │
└──────────┬───────────────────────────┘
           │
           ▼
Response: "Based on your symptoms..."
```

## 4. Request Flow - WhatsApp Integration

```
┌─────────┐
│  User   │ "I have fever"
└────┬────┘
     │
     ▼
┌─────────────────┐
│  WhatsApp App   │
└────┬────────────┘
     │ Message sent
     ▼
┌─────────────────────────────────┐
│  Twilio WhatsApp Business API   │
└────┬────────────────────────────┘
     │ POST webhook
     ▼
┌──────────────────────────────────────────┐
│  Backend: /api/whatsapp/webhook          │
│  1. Receive message                      │
│  2. Extract: Body, From, ProfileName     │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  LangChain Service                       │
│  1. Embed query                          │
│  2. Search vector DB                     │
│  3. Call Gemini with context             │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Response Processing                     │
│  1. Check length (truncate if > 1500)    │
│  2. Detect emergencies                   │
│  3. Log to MongoDB                       │
└────┬─────────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────┐
│  Twilio Service: sendWhatsApp()          │
│  Send response back to user              │
└────┬─────────────────────────────────────┘
     │
     ▼
┌─────────────────┐
│  WhatsApp App   │ User receives response
└────┬────────────┘
     │
     ▼
┌─────────┐
│  User   │ Reads medical advice
└─────────┘
```

## 5. Deployment Pipeline

```
┌──────────────────┐
│  Developer       │
│  Local Machine   │
└────┬─────────────┘
     │ git push
     ▼
┌──────────────────────────────────┐
│  GitHub Repository               │
│  github.com/Dhanushiremath/      │
│  Ayurva-chatbot                  │
└────┬─────────────┬───────────────┘
     │             │
     │ Auto-deploy │ Auto-deploy
     │             │
     ▼             ▼
┌─────────────┐  ┌──────────────────┐
│   Vercel    │  │     Render       │
│  (Frontend) │  │    (Backend)     │
│             │  │                  │
│  Build:     │  │  Build:          │
│  npm run    │  │  npm install     │
│  build      │  │  --legacy-peer-  │
│             │  │  deps            │
│  Deploy to  │  │                  │
│  Global CDN │  │  Start:          │
│             │  │  node server.js  │
└─────────────┘  └──────────────────┘
     │                    │
     │                    │
     │                    ▼
     │           ┌──────────────────┐
     │           │  External APIs   │
     │           │  • Gemini API    │
     │           │  • Twilio API    │
     │           │  • Firebase      │
     │           │  • MongoDB Atlas │
     │           └──────────────────┘
     │
     ▼
┌──────────────────┐
│  End Users       │
│  Worldwide       │
└──────────────────┘
```

## 6. Tech Stack Visual (Copy to Eraser.io)

```
AYURVA TECH STACK
═════════════════

┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                   │
├─────────────────────────────────────────────────────────┤
│  React 18  │  Vite  │  React Router  │  i18next        │
│  Axios  │  Google Maps API  │  CSS3  │  Responsive     │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                     API GATEWAY LAYER                   │
├─────────────────────────────────────────────────────────┤
│  Express.js  │  CORS  │  Helmet  │  Body Parser        │
│  JWT Middleware  │  Firebase Admin  │  Error Handler   │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   AI INTELLIGENCE LAYER                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  PRIMARY: LangChain + Google Gemini             │   │
│  │  • RAG Implementation                           │   │
│  │  • HNSWLib Vector Database                      │   │
│  │  • Google Embeddings                            │   │
│  │  • Medical Knowledge Retrieval                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  FALLBACK 1: Rasa NLP                           │   │
│  │  • Intent Classification                        │   │
│  │  • Entity Extraction                            │   │
│  │  • Dialogue Management                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  FALLBACK 2: Local NLP                          │   │
│  │  • Pattern Matching                             │   │
│  │  • Rule-based Engine                            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                    INTEGRATION LAYER                    │
├─────────────────────────────────────────────────────────┤
│  Twilio WhatsApp API  │  Google Maps API                │
│  Firebase Auth  │  Mongoose ODM                         │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                      DATA LAYER                         │
├─────────────────────────────────────────────────────────┤
│  MongoDB Atlas (Cloud Database)                         │
│  • users collection                                     │
│  • conversations collection                             │
│  • diseases collection                                  │
│  • vaccinations collection                              │
└─────────────────────────────────────────────────────────┘
```

## 7. Component Architecture (Frontend)

```
App.jsx (Root)
│
├── LanguageSelector
│   └── i18next integration
│
├── Tab Navigation
│   ├── Chatbot Tab
│   ├── Location Tab
│   └── Health Insights Tab
│
├── ChatInterface (Chatbot Tab)
│   ├── MessageList
│   │   └── Message components
│   ├── InputArea
│   │   ├── TextInput
│   │   ├── VoiceInput
│   │   └── SendButton
│   └── QuickActions
│
├── HospitalMap (Location Tab)
│   ├── Google Maps Component
│   ├── Search Bar
│   ├── Hospital Markers
│   └── Info Windows
│
└── Health Insights Tab
    ├── HealthSidebar
    │   ├── Vaccination Tracker
    │   ├── Disease Info Cards
    │   └── Health Tips
    └── ActionHub
        ├── Emergency Contacts
        ├── Health Resources
        └── Quick Links
```

## 8. API Endpoints Structure

```
Backend API Routes
│
├── /api/auth
│   ├── POST /register
│   ├── POST /login
│   └── POST /logout
│
├── /api/chat
│   ├── POST /message (Process chat message)
│   └── GET /history/:userId (Get conversation history)
│
├── /api/whatsapp
│   ├── POST /webhook (Receive WhatsApp messages)
│   ├── POST /incoming (Alternative webhook)
│   └── POST /status (Delivery status updates)
│
├── /api/hospitals
│   ├── GET /nearby (Find nearby hospitals)
│   └── GET /:id (Get hospital details)
│
├── /api/diseases
│   ├── GET / (List all diseases)
│   ├── GET /:id (Get disease details)
│   └── GET /search (Search diseases)
│
└── /api/vaccinations
    ├── GET / (List vaccinations)
    └── GET /schedule (Get vaccination schedule)
```

## 9. Data Models

```javascript
// User Model
{
  _id: ObjectId,
  email: String,
  name: String,
  phone: String,
  firebaseUid: String,
  createdAt: Date,
  lastActive: Date
}

// Conversation Model
{
  _id: ObjectId,
  userId: ObjectId,
  messages: [{
    role: 'user' | 'assistant',
    content: String,
    timestamp: Date,
    service: 'langchain' | 'rasa' | 'local-nlp'
  }],
  channel: 'web' | 'whatsapp',
  createdAt: Date
}

// Disease Model
{
  _id: ObjectId,
  name: String,
  symptoms: [String],
  causes: [String],
  treatments: [String],
  prevention: [String],
  severity: String
}

// Vaccination Model
{
  _id: ObjectId,
  name: String,
  ageGroup: String,
  schedule: String,
  description: String
}
```

## 10. Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Network Security                             │
│  • HTTPS/TLS encryption                                │
│  • CORS policy (whitelist Vercel domains)              │
│  • Rate limiting                                       │
│                                                         │
│  Layer 2: Authentication                               │
│  • Firebase Authentication                             │
│  • JWT token validation                                │
│  • Session management                                  │
│                                                         │
│  Layer 3: Authorization                                │
│  • Protected routes middleware                         │
│  • User role verification                              │
│  • Resource access control                             │
│                                                         │
│  Layer 4: Data Security                                │
│  • Environment variables for secrets                   │
│  • MongoDB connection encryption                       │
│  • Input validation & sanitization                     │
│  • XSS protection (Helmet.js)                          │
│                                                         │
│  Layer 5: API Security                                 │
│  • API key rotation                                    │
│  • Request validation                                  │
│  • Error message sanitization                          │
│  • Logging & monitoring                                │
└─────────────────────────────────────────────────────────┘
```

## Key Technical Decisions & Rationale

### Why LangChain + RAG?
- **Accuracy**: Grounds AI responses in verified medical data
- **Flexibility**: Easy to update knowledge base without retraining
- **Cost-effective**: Uses existing LLMs with custom data

### Why Three-Tier Fallback?
- **Reliability**: 99%+ uptime even if external APIs fail
- **Cost optimization**: Falls back to cheaper options when needed
- **User experience**: Seamless - users never see failures

### Why MongoDB?
- **Flexible schema**: Healthcare data varies widely per user
- **Scalability**: Handles millions of conversations
- **JSON-native**: Perfect for Node.js/JavaScript stack

### Why Vercel + Render?
- **Vercel**: Best-in-class for React apps, global CDN, instant deployments
- **Render**: Auto-scaling backend, free tier for testing, easy MongoDB integration

### Why WhatsApp?
- **Reach**: 500M+ users in India
- **Accessibility**: No app download needed
- **Familiarity**: People already use it daily

---

## For Eraser.io

Copy the ASCII diagrams above into Eraser.io, or use this simplified structure:

**Boxes to create:**
1. User Interfaces (WhatsApp, Web)
2. Frontend (React, Vite, Vercel)
3. Backend (Express, Node.js, Render)
4. AI Pipeline (LangChain → Rasa → Local NLP)
5. Databases (MongoDB, Firebase, HNSWLib)
6. External APIs (Gemini, Twilio, Google Maps)

**Arrows:**
- User → Frontend (HTTPS)
- Frontend → Backend (REST API)
- Backend → AI Pipeline (Process)
- AI Pipeline → Vector DB (Search)
- Backend → MongoDB (Store/Retrieve)
- Backend → External APIs (Integrate)
- Backend → User (Response)
