# Ayurva Setup Guide

## Configuration Overview

### 1. JWT (JSON Web Token) Configuration

**What it does:** Securely authenticates users and maintains login sessions.

**Setup:**
- Already configured in `backend/config/jwt.config.js`
- JWT_SECRET in `.env` is used to sign tokens
- Tokens expire after 7 days

**To generate a strong secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and update `JWT_SECRET` in `.env`

**Current Status:** ✅ Working (using default secret - change for production!)

---

### 2. Firebase Configuration (Push Notifications)

**What it does:** Sends push notifications for health alerts, vaccination reminders, and emergency notifications.

**Setup Steps:**

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com/
   - Click "Add Project"
   - Enter project name: "Ayurva"
   - Follow the setup wizard

2. **Get Service Account Key:**
   - In Firebase Console, go to Project Settings (gear icon)
   - Click "Service Accounts" tab
   - Click "Generate New Private Key"
   - Save the downloaded JSON file as `firebase-service-account.json`
   - Move it to `backend/config/firebase-service-account.json`

3. **Enable Firebase:**
   - Update `.env`: `FIREBASE_ENABLED=true`

4. **Test:**
   ```bash
   cd backend
   npm start
   ```
   You should see: "✅ Firebase Admin SDK initialized successfully"

**Current Status:** ⚠️ Disabled (optional - only needed for push notifications)

---

### 3. Twilio Configuration (SMS Alerts)

**What it does:** Sends SMS text messages for health alerts and reminders.

**Setup Steps:**

1. **Create Twilio Account:**
   - Go to https://www.twilio.com/try-twilio
   - Sign up for free trial (includes $15 credit)

2. **Get Credentials:**
   - From Twilio Console Dashboard:
     - Copy "Account SID" → Update `TWILIO_SID` in `.env`
     - Copy "Auth Token" → Update `TWILIO_TOKEN` in `.env`
   - Get a phone number:
     - Go to Phone Numbers → Buy a Number
     - Copy the number → Update `TWILIO_PHONE` in `.env`

3. **Test:**
   ```javascript
   // In backend, test with:
   const twilioService = require('./services/twilio-service');
   twilioService.sendSMS('+1234567890', 'Test message from Ayurva');
   ```

**Current Status:** ⚠️ Not configured (optional - only needed for SMS alerts)

---

### 4. MongoDB Configuration

**What it does:** Stores user data, conversations, and health records.

**Current Status:** ✅ Configured (but needs IP whitelisting)

**Fix Connection Issue:**
1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click "Network Access" in left sidebar
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (for development)
5. Click "Confirm"

---

### 5. HuggingFace API (AI/NLP)

**What it does:** Powers the AI chatbot's natural language understanding.

**Current Status:** ✅ Configured

---

## Quick Start Checklist

### Minimum Required (App will work):
- [x] JWT_SECRET (has default value)
- [x] MONGODB_URI (needs IP whitelist fix)
- [x] HUGGINGFACE_API_KEY (configured)

### Optional Features:
- [ ] Firebase (for push notifications)
- [ ] Twilio (for SMS alerts)

---

## Environment Variables Summary

```env
# Required
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
HUGGINGFACE_API_KEY=your_huggingface_key

# Optional - SMS Alerts
TWILIO_SID=your_twilio_account_sid
TWILIO_TOKEN=your_twilio_auth_token
TWILIO_PHONE=your_twilio_phone_number

# Optional - Push Notifications
FIREBASE_ENABLED=false  # Set to 'true' when configured
```

---

## Testing Your Setup

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```
   Check console for initialization messages.

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Open http://localhost:5173

3. **Test Authentication:**
   - Sign up with a phone number
   - Check if JWT token is generated
   - Try logging in with the same phone

4. **Test Chat:**
   - Send a health query
   - Check if AI responds

---

## Troubleshooting

### MongoDB Connection Error
- **Issue:** "Could not connect to any servers"
- **Fix:** Whitelist your IP in MongoDB Atlas Network Access

### Firebase Not Working
- **Issue:** Push notifications not sending
- **Fix:** Ensure `firebase-service-account.json` exists and `FIREBASE_ENABLED=true`

### Twilio SMS Not Sending
- **Issue:** SMS not received
- **Fix:** Verify phone number format (+1234567890) and Twilio credentials

### JWT Token Invalid
- **Issue:** "Invalid or expired token"
- **Fix:** Token expires after 7 days - user needs to login again

---

## Production Deployment

Before deploying to production:

1. **Generate Strong JWT Secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Secure Environment Variables:**
   - Never commit `.env` to git
   - Use environment variable management (Heroku Config Vars, AWS Secrets Manager, etc.)

3. **MongoDB Security:**
   - Restrict IP access to your server's IP only
   - Use strong database password

4. **Enable HTTPS:**
   - Use SSL certificates
   - Update CORS settings

5. **Rate Limiting:**
   - Add rate limiting to prevent abuse
   - Implement request throttling

---

## Need Help?

- JWT Issues: Check `backend/config/jwt.config.js`
- Firebase Issues: Check `backend/config/firebase.config.js`
- Twilio Issues: Check `backend/services/twilio-service.js`
