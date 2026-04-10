# Performance Optimization Guide for Ayurva

## 🔍 Identified Issues

### 1. **CRITICAL: Render Free Tier Cold Starts (15-30 seconds)**
- **Problem**: Render free tier spins down after 15 minutes of inactivity
- **Impact**: First request takes 15-30 seconds to wake up the server
- **User Experience**: Website loads but chatbot doesn't respond for 30+ seconds

### 2. **AI Response Time (3-8 seconds)**
- **Problem**: LangChain + Gemini API calls take 3-8 seconds per response
- **Impact**: Users wait too long for chatbot replies
- **Cause**: Complex agent executor with tools initialization

##

## Solutions & Optimizations

### Solution 1: Keep Render Server Alive (Cold Start Fix)

#### Option A: External Ping Service (Free)
Use a service to ping your backend every 10 minutes:

**UptimeRobot** (Free tier - 50 monitors)
1. Sign up at https://uptimerobot.com
2. Add monitor: `https://ayurva-chatbot.onrender.com/api/health`
3. Set interval: 5 minutes
4. Result: Server stays warm 24/7

**Cron-job.org** (Free)
1. Sign up at https://cron-job.org
2. Create job: GET `https://ayurva-chatbot.onrender.com/api/health`
3. Schedule: Every 10 minutes
4. Result: Prevents cold starts

#### Option B: Self-Ping with GitHub Actions (Free)
Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Render Alive
on:
  schedule:
    - cron: '*/10 * * * *'  # Every 10 minutes
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Render Backend
        run: |
          curl -f https://ayurva-chatbot.onrender.com/api/health || exit 0
```

#### Option C: Upgrade to Render Paid Plan ($7/month)
- No cold starts
- Always-on instances
- Better performance
- Recommended for production

### Solution 2: Optimize AI Response Time

#### A. Implement Response Streaming
Instead of waiting for complete response, stream tokens as they're generated:

**Backend: Update langchain-service.js**
```javascript
// Add streaming support
async processMessageStream(message, onToken) {
  const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-pro",
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          onToken(token);
        },
      },
    ],
  });
  
  // Rest of RAG implementation with streaming
}
```

**Frontend: Update ChatInterface**
```javascript
const [streamingMessage, setStreamingMessage] = useState('');

const sendMessage = async (message) => {
  const response = await fetch('/api/chat/stream', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
  
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    setStreamingMessage(prev => prev + chunk);
  }
};
```

**Impact**: Users see response appearing word-by-word (feels 3x faster)

#### B. Implement Caching Layer
Cache common medical queries:

**Install Redis or use in-memory cache:**
```javascript
// backend/services/cache-service.js
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

async function getCachedResponse(query) {
  const normalizedQuery = query.toLowerCase().trim();
  return cache.get(normalizedQuery);
}

async function setCachedResponse(query, response) {
  const normalizedQuery = query.toLowerCase().trim();
  cache.set(normalizedQuery, response);
}

module.exports = { getCachedResponse, setCachedResponse };
```

**Update chat route:**
```javascript
const cacheService = require('../services/cache-service');

router.post('/message', async (req, res) => {
  const { message } = req.body;
  
  // Check cache first
  const cached = await cacheService.getCachedResponse(message);
  if (cached) {
    return res.json({ response: cached, cached: true });
  }
  
  // Process with AI
  const response = await langchainService.processMessage(message);
  
  // Cache the response
  await cacheService.setCachedResponse(message, response);
  
  res.json({ response, cached: false });
});
```

**Impact**: Common queries (fever, cold, headache) return instantly

#### C. Optimize Vector Search
Reduce retrieval time:

```javascript
// Reduce number of documents retrieved
const retriever = vectorStore.asRetriever({
  k: 3, // Changed from 5 to 3 (faster, still accurate)
  searchType: "similarity",
});

// Pre-load vector store at startup
let vectorStore = null;

async function initializeVectorStore() {
  if (!vectorStore) {
    vectorStore = await HNSWLib.load(
      path.join(__dirname, '../data/vector_store'),
      embeddings
    );
  }
  return vectorStore;
}

// Call on server startup
initializeVectorStore();
```

**Impact**: Reduces retrieval time by 30-40%

### Solution 3: Frontend Performance

#### A. Implement Loading States
Show users something is happening:

```javascript
// ChatInterface.jsx
const [isTyping, setIsTyping] = useState(false);

const sendMessage = async (message) => {
  setIsTyping(true);
  try {
    const response = await api.post('/chat/message', { message });
    // Handle response
  } finally {
    setIsTyping(false);
  }
};

// Show typing indicator
{isTyping && (
  <div className="typing-indicator">
    <span></span><span></span><span></span>
    Ayurva is thinking...
  </div>
)}
```

#### B. Lazy Load Components
Load tabs only when needed:

```javascript
// App.jsx
import { lazy, Suspense } from 'react';

const ChatInterface = lazy(() => import('./components/ChatInterface'));
const HospitalMap = lazy(() => import('./components/HospitalMap'));
const HealthSidebar = lazy(() => import('./components/HealthSidebar'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {activeTab === 'chat' && <ChatInterface />}
      {activeTab === 'location' && <HospitalMap />}
      {activeTab === 'health' && <HealthSidebar />}
    </Suspense>
  );
}
```

**Impact**: Initial page load 40% faster

#### C. Optimize Bundle Size
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer

# Remove unused dependencies
npm uninstall <unused-packages>

# Use production builds
NODE_ENV=production npm run build
```

### Solution 4: Database Optimization

#### A. Add Indexes to MongoDB
```javascript
// In your models
// User.js
userSchema.index({ email: 1 });
userSchema.index({ firebaseUid: 1 });

// Conversation.js
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ 'messages.timestamp': -1 });
```

#### B. Limit Query Results
```javascript
// Get recent conversations only
const conversations = await Conversation.find({ userId })
  .sort({ createdAt: -1 })
  .limit(20) // Only last 20 conversations
  .select('messages createdAt') // Only needed fields
  .lean(); // Return plain objects (faster)
```

**Impact**: Database queries 50-70% faster

### Solution 5: WhatsApp Optimization

#### A. Async Processing
Don't make Twilio wait for AI response:

```javascript
router.post('/webhook', async (req, res) => {
  const { Body, From } = req.body;
  
  // Respond to Twilio immediately
  res.type('text/xml');
  res.send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  
  // Process message asynchronously
  processMessageAsync(Body, From).catch(console.error);
});

async function processMessageAsync(message, from) {
  const response = await langchainService.processMessage(message);
  await twilioService.sendWhatsApp(from, response);
}
```

**Impact**: Twilio webhook responds in <100ms (prevents timeouts)

### Solution 6: Add Health Check Endpoint

```javascript
// backend/routes/health.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/health', async (req, res) => {
  const health = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    status: 'OK',
    services: {
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      memory: process.memoryUsage(),
    }
  };
  
  res.json(health);
});

router.get('/ping', (req, res) => {
  res.send('pong');
});

module.exports = router;
```

Add to server.js:
```javascript
const healthRoutes = require('./routes/health');
app.use('/api', healthRoutes);
```

### Solution 7: Implement Rate Limiting

Prevent abuse and manage costs:

```javascript
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 minutes
  message: 'Too many requests, please try again later.',
});

app.use('/api/chat', chatLimiter);
```

## Performance Metrics Target

| Metric | Current | Target | Solution |
|--------|---------|--------|----------|
| Cold Start | 15-30s | 0s | UptimeRobot + Health endpoint |
| AI Response | 3-8s | 1-3s | Streaming + Caching + Optimize retrieval |
| Page Load | 2-3s | <1s | Lazy loading + Bundle optimization |
| Database Query | 200-500ms | <100ms | Indexes + Query optimization |
| WhatsApp Response | 5-10s | <3s | Async processing + Caching |

## Implementation Priority

### Phase 1: Quick Wins (Do Now)
1. ✅ Set up UptimeRobot to prevent cold starts
2. ✅ Add health check endpoint
3. ✅ Implement caching for common queries
4. ✅ Add loading indicators in frontend
5. ✅ Optimize vector search (k=3 instead of 5)

### Phase 2: Medium Effort (This Week)
1. Add MongoDB indexes
2. Implement response streaming
3. Add lazy loading for components
4. Optimize database queries
5. Add rate limiting

### Phase 3: Advanced (Next Sprint)
1. Upgrade to Render paid plan (if budget allows)
2. Implement Redis caching
3. Add CDN for static assets
4. Implement service worker for offline support
5. Add performance monitoring (Sentry, LogRocket)

## Monitoring & Testing

### Add Performance Logging
```javascript
// middleware/performance.js
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    // Alert if slow
    if (duration > 5000) {
      console.warn(`SLOW REQUEST: ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};

app.use(performanceMiddleware);
```

### Frontend Performance Tracking
```javascript
// Track AI response time
const startTime = performance.now();
const response = await api.post('/chat/message', { message });
const endTime = performance.now();
console.log(`AI Response Time: ${endTime - startTime}ms`);

// Send to analytics
analytics.track('ai_response_time', {
  duration: endTime - startTime,
  cached: response.data.cached,
});
```

## Cost Optimization

### Current Costs (Free Tier)
- Vercel: $0/month (Free tier)
- Render: $0/month (Free tier with cold starts)
- MongoDB Atlas: $0/month (Free tier - 512MB)
- Firebase: $0/month (Free tier)
- Gemini API: $0/month (Free tier - 60 requests/min)
- Twilio: ~$0.005 per WhatsApp message

### Recommended Upgrades (Production)
- Render: $7/month (No cold starts, better performance)
- MongoDB Atlas: $9/month (Shared cluster, 2GB)
- Total: ~$16/month for production-ready setup

## Quick Implementation Script

Run these commands to implement Phase 1 optimizations:

```bash
# 1. Install caching
cd backend
npm install node-cache

# 2. Create cache service
cat > services/cache-service.js << 'EOF'
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

async function getCachedResponse(query) {
  const key = query.toLowerCase().trim();
  return cache.get(key);
}

async function setCachedResponse(query, response) {
  const key = query.toLowerCase().trim();
  cache.set(key, response);
}

module.exports = { getCachedResponse, setCachedResponse };
EOF

# 3. Create health endpoint
cat > routes/health.js << 'EOF'
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

module.exports = router;
EOF

# 4. Commit and deploy
git add .
git commit -m "Add caching and health endpoint for performance"
git push origin main

echo "✅ Phase 1 optimizations deployed!"
echo "📝 Next: Set up UptimeRobot at https://uptimerobot.com"
echo "🎯 Monitor: https://ayurva-chatbot.onrender.com/api/health"
```

## Results After Optimization

Expected improvements:
- ✅ Cold starts: Eliminated (with UptimeRobot)
- ✅ Common queries: <500ms (with caching)
- ✅ AI responses: 1-3s (with streaming + optimization)
- ✅ Page load: <1s (with lazy loading)
- ✅ User experience: Feels 5x faster

---

**Next Steps:**
1. Implement Phase 1 optimizations immediately
2. Set up UptimeRobot monitoring
3. Test performance improvements
4. Monitor metrics for 1 week
5. Proceed to Phase 2 based on results
