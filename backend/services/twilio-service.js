const twilio = require('twilio');

class TwilioService {
  constructor() {
    this.client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    this.whatsappNumber = 'whatsapp:+14155238886'; // Sandbox number
  }

  async sendSMS(to, body) {
    try {
      const message = await this.client.messages.create({
        body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to
      });
      return message.sid;
    } catch (error) {
      console.error('Twilio SMS Error:', error);
      throw error;
    }
  }

  async sendWhatsApp(to, body) {
    try {
      console.log(`📤 Sending WhatsApp message to: ${to}`);
      // Ensure phone number starts with +
      let phoneNumber = to;
      if (!phoneNumber.startsWith('+')) {
        phoneNumber = '+' + phoneNumber;
      }
      
      const payload = {
        body,
        from: this.whatsappNumber,
        to: `whatsapp:${phoneNumber}`
      };
      
      console.log('📦 Twilio WhatsApp Payload:', JSON.stringify(payload, null, 2));

      const message = await this.client.messages.create(payload);
      
      console.log('✅ Twilio WhatsApp Success! SID:', message.sid);
      return message.sid;
    } catch (error) {
      console.error('❌ Twilio WhatsApp Error:', error.message);
      if (error.code) console.error('Error Code:', error.code);
      if (error.moreInfo) console.error('More Info:', error.moreInfo);
      throw error;
    }
  }
}

module.exports = new TwilioService();
