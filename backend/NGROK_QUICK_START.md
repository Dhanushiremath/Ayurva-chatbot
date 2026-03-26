# 🚀 ngrok WhatsApp Webhook - Quick Start

## What is ngrok?

ngrok creates a secure tunnel from the internet to your local backend, making it accessible to Twilio's WhatsApp webhooks.

```
Internet (Twilio) → ngrok tunnel → Your localhost:5000
```

---

## Step-by-Step Setup

### 1️⃣ Install ngrok

**Option A: Download**
- Go to: https://ngrok.com/download
- Download for Windows
- Extract the .exe file

**Option B: Chocolatey (if you have it)**
```bash
choco install ngrok
```

### 2️⃣ Sign Up (Free)

1. Create account: https://dashboard.ngrok.com/signup
2. Get your auth token from: https://dashboard.ngrok.com/get-started/your-authtoken
3. Connect your account:
```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### 3️⃣ Start Your Backend

```bash
cd backend
npm start
```

✅ Backend should be running on http://localhost:5000

### 4️⃣ Start ngrok Tunnel

Open a NEW terminal (keep backend running):

```bash
ngrok http 5000
```

You'll see:
```
Session Status    online
Forwarding        https://abc123-xyz.ngrok-free.app -> http://localhost:5000
```

📋 **Copy the HTTPS URL** (e.g., `https://abc123-xyz.ngrok-free.app`)

### 5️⃣ Configure Twilio Webhook

1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Scroll to **"Sandbox Configuration"**
3. Find **"WHEN A MESSAGE COMES IN"**
4. Paste: `https://abc123-xyz.ngrok-free.app/api/whatsapp/incoming`
5. Method: **POST**
6. Click **"Save"**

### 6️⃣ Test on WhatsApp!

1. Open WhatsApp
2. Send message to: **+1 415 523 8886**
3. Try: "I have fever and headache"
4. Wait for Ayurva's response!

---

## 🎯 What Happens When User Sends Message

```
User sends WhatsApp message
         ↓
Twilio receives it
         ↓
Twilio POSTs to: https://your-ngrok-url.ngrok-free.app/api/whatsapp/incoming
         ↓
ngrok forwards to: http://localhost:5000/api/whatsapp/incoming
         ↓
Your backend processes with LangChain/Rasa/NLP
         ↓
Backend sends response via Twilio API
         ↓
User receives AI response on WhatsApp
```

---

## 📱 Example Conversations

### Symptom Check:
```
You: I have fever and cough
Ayurva: Based on your symptoms (fever, cough), here's what I can tell you:
        • Rest and stay hydrated
        • Monitor your temperature
        • If symptoms persist beyond 3 days, consult a doctor
        *Disclaimer: I am an AI assistant, not a doctor...*
```

### Emergency Detection:
```
You: Severe chest pain
Ayurva: 🚨 EMERGENCY ALERT
        This condition appears life-threatening.
        Seek immediate help!
        Contact: 108 (India) or 911 (US)
```

### General Health:
```
You: What are symptoms of diabetes?
Ayurva: The symptoms of diabetes include:
        • Increased thirst and frequent urination
        • Increased hunger
        • Unexplained weight loss
        • Fatigue
        ...
```

---

## 🔍 Monitoring & Debugging

### Check Backend Logs
In your backend terminal, you'll see:
```
=== Incoming WhatsApp Message ===
From: whatsapp:+919876543210
Name: John Doe
Message: I have fever
🔗 LangChain Agent processing: I have fever
✅ Response via langchain sent successfully
```

### Check ngrok Dashboard
Visit: http://localhost:4040
- See all incoming requests
- View request/response details
- Debug webhook issues

---

## ⚠️ Common Issues

### Issue 1: "ngrok not found"
**Solution:** 
- Make sure ngrok.exe is in your PATH
- Or run from the folder where you extracted it: `./ngrok http 5000`

### Issue 2: Bot doesn't respond
**Check:**
1. ✅ Backend running? (http://localhost:5000)
2. ✅ ngrok running? (check terminal)
3. ✅ Webhook URL correct in Twilio?
4. ✅ Check backend logs for errors

### Issue 3: ngrok URL expired
**Solution:**
- Free ngrok URLs change every time you restart
- Update Twilio webhook URL with new ngrok URL
- Or upgrade to ngrok paid plan for permanent URLs

### Issue 4: "Webhook Error" in Twilio
**Check:**
- Is the URL correct? Should end with `/api/whatsapp/incoming`
- Is ngrok still running?
- Check ngrok dashboard: http://localhost:4040

---

## 💡 Pro Tips

1. **Keep Both Terminals Open:**
   - Terminal 1: Backend (`npm start`)
   - Terminal 2: ngrok (`ngrok http 5000`)

2. **Bookmark ngrok Dashboard:**
   - http://localhost:4040
   - Great for debugging

3. **Test Locally First:**
   ```bash
   curl -X POST http://localhost:5000/api/whatsapp/incoming \
     -d "Body=Hello&From=whatsapp:+919876543210"
   ```

4. **Free vs Paid ngrok:**
   - Free: URL changes on restart, 40 connections/min
   - Paid: Permanent URL, more connections

---

## 🎮 Quick Commands Reference

```bash
# Start backend
cd backend
npm start

# Start ngrok (in new terminal)
ngrok http 5000

# Check if backend is running
curl http://localhost:5000

# View ngrok dashboard
# Open browser: http://localhost:4040
```

---

## 📊 Current Setup Status

✅ Backend webhook endpoint ready: `/api/whatsapp/incoming`
✅ Twilio WhatsApp sandbox configured
✅ LangChain AI integration working
✅ Fallback system (LangChain → Rasa → Local NLP)

❓ Need ngrok to make it publicly accessible

---

## 🚀 Ready to Go?

1. Start backend: `npm start`
2. Start ngrok: `ngrok http 5000`
3. Copy ngrok URL
4. Update Twilio webhook
5. Send WhatsApp message to test!

Your AI healthcare assistant is ready to chat on WhatsApp! 🎉
