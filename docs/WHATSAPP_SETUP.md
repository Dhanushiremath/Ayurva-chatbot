# Twilio WhatsApp Setup Guide

## Why WhatsApp Instead of SMS?

For India and many other countries, WhatsApp is:
- ✅ **Free** - No per-message charges
- ✅ **More reliable** - Better delivery rates
- ✅ **Popular** - Most users already have WhatsApp
- ✅ **Rich media** - Can send images, buttons, etc.

---

## Step 1: Join Twilio WhatsApp Sandbox

Before you can send WhatsApp messages, you need to join the sandbox:

1. **Go to Twilio Console:**
   - Visit: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
   - Or: Console → Messaging → Try it out → Send a WhatsApp message

2. **You'll see a sandbox number and join code:**
   ```
   Sandbox Number: +1 415 523 8886
   Join Code: join [your-code]
   ```
   Example: `join happy-tiger`

3. **Join from your WhatsApp:**
   - Open WhatsApp on your phone
   - Start a new chat with: **+1 415 523 8886**
   - Send the message: `join happy-tiger` (use YOUR code, not this example)
   - Wait for confirmation message

4. **Confirmation:**
   You'll receive: "Twilio Sandbox: ✅ You are all set!"

---

## Step 2: Test WhatsApp Messaging

### Option A: Using Test Page

1. Open `backend/test-twilio.html` in your browser
2. Select your country (India +91)
3. Enter your 10-digit WhatsApp number
4. Click "Send WhatsApp Message"
5. Check your WhatsApp!

### Option B: Using Postman/API

**Endpoint:** `POST http://localhost:5000/api/test/whatsapp`

**Body:**
```json
{
  "phone": "+919876543210",
  "message": "Hello from Ayurva!"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "WhatsApp message sent successfully!",
  "messageSid": "SMxxxxxxxx",
  "sentTo": "+919876543210"
}
```

---

## Step 3: Production Setup (Optional)

For production use (not sandbox):

1. **Request WhatsApp Business API Access:**
   - Go to: https://www.twilio.com/whatsapp/request-access
   - Fill out the form
   - Wait for approval (can take a few days)

2. **Get a WhatsApp Business Number:**
   - Once approved, you'll get a dedicated WhatsApp number
   - No more sandbox limitations
   - Can send to any WhatsApp user

3. **Update Your Code:**
   - Replace sandbox number with your business number
   - No need for users to join sandbox

---

## Common Issues & Solutions

### Issue: "Not a valid WhatsApp recipient"
**Solution:** Make sure you joined the sandbox first with the join code.

### Issue: "Message not received"
**Solutions:**
1. Check if you sent the join code correctly
2. Make sure you're using the same phone number
3. Wait a few seconds and try again
4. Check WhatsApp is connected to internet

### Issue: "Sandbox expired"
**Solution:** Sandbox sessions expire after 24 hours. Send the join code again.

### Issue: "Invalid phone number format"
**Solution:** Use international format: +919876543210 (no spaces or dashes)

---

## WhatsApp vs SMS Comparison

| Feature | WhatsApp (Sandbox) | SMS |
|---------|-------------------|-----|
| Cost | Free | ~$0.0075 per message |
| Setup | Join sandbox | Verify numbers |
| Delivery | Instant | Can be delayed |
| Rich Media | ✅ Yes | ❌ No |
| India Support | ✅ Excellent | ⚠️ Limited |
| Production Ready | Need approval | ✅ Ready |

---

## Integration in Your App

Once WhatsApp is working, you can use it for:

### 1. Health Alerts
```javascript
twilioService.sendWhatsApp(
  '+919876543210',
  '🏥 Health Alert: Your vaccination is due next week!'
);
```

### 2. Appointment Reminders
```javascript
twilioService.sendWhatsApp(
  user.phone,
  '📅 Reminder: Doctor appointment tomorrow at 10 AM'
);
```

### 3. Emergency Notifications
```javascript
twilioService.sendWhatsApp(
  user.phone,
  '🚨 URGENT: Based on your symptoms, please seek immediate medical attention.'
);
```

---

## Next Steps

1. ✅ Join WhatsApp Sandbox
2. ✅ Test with your number
3. ✅ Integrate into your app
4. 📋 Request production access (optional)

---

## Need Help?

- Twilio WhatsApp Docs: https://www.twilio.com/docs/whatsapp
- Sandbox Console: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
- Check backend logs for detailed errors
