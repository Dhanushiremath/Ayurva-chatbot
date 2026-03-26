# WhatsApp Chatbot Setup Guide

## How to Chat with Ayurva on WhatsApp

Currently, your app sends notifications TO WhatsApp. To enable TWO-WAY chat (users can ask questions IN WhatsApp), you need to set up webhooks.

---

## Option 1: Local Testing with ngrok (Development)

### Step 1: Install ngrok

1. Download ngrok: https://ngrok.com/download
2. Extract and install
3. Sign up for free account: https://dashboard.ngrok.com/signup

### Step 2: Start Your Backend

```bash
cd backend
npm start
```

Your backend should be running on http://localhost:5000

### Step 3: Create ngrok Tunnel

Open a new terminal and run:

```bash
ngrok http 5000
```

You'll see output like:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:5000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### Step 4: Configure Twilio Webhook

1. Go to Twilio Console: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Scroll to "Sandbox Configuration"
3. Find "WHEN A MESSAGE COMES IN"
4. Enter: `https://abc123.ngrok.io/api/whatsapp/incoming`
5. Method: POST
6. Click "Save"

### Step 5: Test It!

1. Open WhatsApp
2. Send a message to +1 415 523 8886
3. Try: "I have fever and headache"
4. Ayurva will respond automatically!

---

## Option 2: Production Deployment (Heroku/AWS/etc.)

### Requirements:
- Deploy your backend to a public server
- Get a public HTTPS URL (e.g., https://your-app.herokuapp.com)

### Configure Twilio:
1. Go to Twilio Console
2. Set webhook URL: `https://your-app.herokuapp.com/api/whatsapp/incoming`
3. Save

---

## How It Works

```
User sends WhatsApp message
         ↓
Twilio receives message
         ↓
Twilio sends to your webhook: /api/whatsapp/incoming
         ↓
Your backend processes with NLP
         ↓
Backend sends response via Twilio
         ↓
User receives response on WhatsApp
```

---

## Example Conversations

### Symptom Check:
```
User: I have fever and cough
Bot: Based on your symptoms (fever, cough), here's what I can tell you:
     ⚠️ This is general information only...
     💡 Recommendations:
     • Rest and stay hydrated
     • Monitor your temperature
```

### Disease Info:
```
User: Tell me about dengue
Bot: Information about dengue:
     📋 This is a common health concern...
     1. Consult a qualified doctor
     2. Get proper diagnosis
```

### Vaccination:
```
User: When should I get flu vaccine?
Bot: 💉 Vaccination Information:
     Common vaccines:
     • COVID-19
     • Flu (Influenza)
     ...
```

### Emergency:
```
User: Severe chest pain, can't breathe
Bot: 🚨 EMERGENCY ALERT
     Please seek immediate medical attention.
     Call emergency services: 108 (India)
```

---

## Testing Without ngrok (Current Setup)

Right now, you can:
✅ Send notifications FROM app TO WhatsApp
✅ Test WhatsApp delivery
✅ Manage notification preferences

To enable chatting IN WhatsApp, you need:
❌ Public webhook URL (ngrok or deployed server)

---

## Quick Start with ngrok

1. **Install ngrok:**
   ```bash
   # Windows (with Chocolatey)
   choco install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start backend:**
   ```bash
   cd backend
   npm start
   ```

3. **Start ngrok:**
   ```bash
   ngrok http 5000
   ```

4. **Copy the HTTPS URL** (e.g., https://abc123.ngrok.io)

5. **Configure Twilio:**
   - Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - Webhook URL: `https://abc123.ngrok.io/api/whatsapp/incoming`
   - Save

6. **Test on WhatsApp:**
   - Send message to +1 415 523 8886
   - Try: "Hello" or "I have fever"

---

## Troubleshooting

### Issue: Bot doesn't respond
**Check:**
1. Is backend running? (http://localhost:5000)
2. Is ngrok running? (check terminal)
3. Is webhook URL correct in Twilio?
4. Check backend logs for errors

### Issue: ngrok URL expired
**Solution:** 
- Free ngrok URLs expire when you close the terminal
- Restart ngrok and update Twilio webhook URL
- Or upgrade to ngrok paid plan for permanent URLs

### Issue: "Webhook Error"
**Check backend logs:**
```bash
# In backend terminal, you'll see:
=== Incoming WhatsApp Message ===
From: whatsapp:+919876543210
Message: Hello
```

---

## Current vs Full Chatbot

| Feature | Current Setup | With Webhook |
|---------|--------------|--------------|
| Send notifications | ✅ Yes | ✅ Yes |
| Receive messages | ❌ No | ✅ Yes |
| Two-way chat | ❌ No | ✅ Yes |
| Auto-responses | ❌ No | ✅ Yes |
| Symptom analysis | ❌ No | ✅ Yes |

---

## Next Steps

1. Install ngrok
2. Start backend
3. Start ngrok tunnel
4. Configure Twilio webhook
5. Test chatting on WhatsApp!

Your webhook endpoint is ready at: `/api/whatsapp/incoming`

Just need to make it publicly accessible with ngrok or deployment!
