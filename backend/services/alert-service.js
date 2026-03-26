const axios = require('axios');
const twilioService = require('./twilio-service');

class AlertService {
  constructor() {
    this.alerts = []; // Mock data for now
  }

  async fetchOutbreaksFromGov() {
    try {
      // Mock API call to government portal
      return [
        { location: '560001', disease: 'Malaria', severity: 'High', message: 'High malaria alert in your area. Use mosquito nets.' }
      ];
    } catch (error) {
      console.error('Gov API Error:', error);
      return [];
    }
  }

  async pushAlertsToSubscribers(pincode) {
    const alerts = await this.fetchOutbreaksFromGov();
    const relevantAlerts = alerts.filter(a => a.location === pincode);

    for (const alert of relevantAlerts) {
      // In production, fetch users subscribed to this pincode and send via Twilio/Firebase
      console.log(`Pushing alert: ${alert.message} to pincode ${pincode}`);
    }
  }
}

module.exports = new AlertService();
