# How to Test Twilio SMS Feature

## Method 1: Using the Test Web Page (Easiest)

1. **Open the test page:**
   - Navigate to: `backend/test-twilio.html`
   - Double-click to open in your browser
   - Or open: http://localhost:5000 (if served)

2. **Enter your phone number:**
   - Format: `+1234567890` (include + and country code)
   - Example: `+919876543210` (India)
   - Example: `+17542976532` (USA)

3. **Enter a message** (or use the default)

4. **Click "Send SMS"**

5. **Check your phone** for the message!

---

## Method 2: Using Postman or Thunder Client

### Test SMS Endpoint

**URL:** `POST http://localhost:5000/api/test/sms`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "phone": "+1234567890",
  "message": "Hello from Ayurva! This is a test message."
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "SMS sent successfully!",
  "messageSid": "SMxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "sentTo": "+1234567890",
  "body": "Hello from Ayurva! This is a test message."
}
```

---

## Method 3: Using cURL (Command Line)

```bash
curl -X POST http://localhost:5000/api/test/sms \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"+1234567890\",\"message\":\"Test from Ayurva\"}"
```

---

## Method 4: Check Twilio Status

**URL:** `GET http://localhost:5000/api/test/twilio-status`

This will show if Twilio is properly configured:

```json
{
  "configured": true,
  "accountSid": "ACdfa2d8f3...",
  "phoneNumber": "+17542976532",
  "status": "Ready to send SMS"
}
```

---

## Important Notes for Trial Accounts

⚠️ **Twilio Trial Account Limitations:**

1. **Verified Numbers Only:**
   - You can ONLY send SMS to phone numbers you've verified in Twilio Console
   - To verify a number:
     - Go to https://console.twilio.com/
     - Click "Phone Numbers" → "Verified Caller IDs"
     - Click "+" to add a new number
     - Enter the number and verify with the code sent

2. **Trial Message Prefix:**
   - All messages will include: "Sent from your Twilio trial account"

3. **Free Credit:**
   - Trial includes $15.50 credit
   - Each SMS costs ~$0.0075

4. **To Remove Limitations:**
   - Upgrade to a paid account (no monthly fee, pay-as-you-go)
   - Go to Console → Billing → Upgrade

---

## Troubleshooting

### Error: "The number +1234567890 is unverified"
**Solution:** Verify the phone number in Twilio Console first.

### Error: "Unable to create record"
**Solution:** Check that your Twilio credentials are correct in `.env`

### Error: "Connection refused"
**Solution:** Make sure backend server is running on port 5000

### Error: "Invalid phone number"
**Solution:** Use international format with + and country code (e.g., +1234567890)

---

## Testing in Your App

Once Twilio is working, you can integrate SMS alerts in your app:

### Example Use Cases:

1. **Vaccination Reminders:**
```javascript
twilioService.sendSMS(
  user.phone, 
  'Reminder: Your flu vaccination is due next week. Book your appointment today!'
);
```

2. **Health Alerts:**
```javascript
twilioService.sendSMS(
  user.phone,
  'Health Alert: High fever detected. Please consult a doctor if symptoms persist.'
);
```

3. **Emergency Notifications:**
```javascript
twilioService.sendSMS(
  user.phone,
  'EMERGENCY: Based on your symptoms, please seek immediate medical attention.'
);
```

---

## Next Steps

After testing SMS:
1. Integrate SMS alerts in your chat flow
2. Add vaccination reminder scheduling
3. Set up emergency alert triggers
4. Create user notification preferences

---

## Need Help?

- Twilio Documentation: https://www.twilio.com/docs/sms
- Twilio Console: https://console.twilio.com/
- Check backend logs for detailed error messages
