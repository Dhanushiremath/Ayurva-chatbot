# Switch to Google Gemini (FREE & No Thinking Artifacts!)

## Why Google Gemini?

✅ **FREE tier** - 60 requests per minute  
✅ **No thinking process shown** - Clean, direct answers  
✅ **Better medical knowledge** - More accurate responses  
✅ **Faster** - Quicker than HuggingFace  
✅ **No subscription needed** - Completely free to use  

## Setup Steps

### 1. Get Your Free API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project" (or use existing)
4. Copy the API key (starts with `AIza...`)

### 2. Add to Your .env File

Open `backend/.env` and replace:

```env
GOOGLE_API_KEY=AIzaSyC_your_actual_key_here
```

### 3. Switch to Gemini Service

Open `backend/routes/chatRoutes.js` and change:

```javascript
const nlpService = require('../services/nlp-service-gemini');
```

### 4. Restart Backend

```bash
cd backend
npm start
```

### 5. Test It!

Ask any question - you'll get clean, professional responses with NO thinking process!

## Example Responses

**Question:** "What causes OCD?"

**Gemini Response:**  
"OCD (Obsessive-Compulsive Disorder) is caused by a combination of genetic, neurological, and environmental factors. Brain imaging shows differences in areas responsible for fear and anxiety processing. Treatment typically involves therapy and medication."

**No more `<think>` tags or AI talking to itself!**

## Free Tier Limits

- 60 requests per minute
- 1,500 requests per day
- More than enough for development and small-scale production

## Need More?

If you exceed limits, you can:
1. Upgrade to paid tier (very cheap)
2. Implement request queuing
3. Use response caching (already implemented)

---

**Your chatbot will now give clean, professional answers to ANY question!**
