const axios = require('axios');

const RASA_URL = process.env.RASA_URL || 'http://localhost:5005';

class RasaService {
  constructor() {
    this.rasaEndpoint = `${RASA_URL}/webhooks/rest/webhook`;
  }

  /**
   * Send message to Rasa and get response
   * @param {string} message - User message
   * @param {string} sender - User ID
   * @returns {Promise<string>} - Bot response
   */
  async processMessage(message, sender = 'user') {
    try {
      console.log('📤 Sending to Rasa:', message);
      
      const response = await axios.post(this.rasaEndpoint, {
        sender: sender,
        message: message
      }, {
        timeout: 10000 // 10 second timeout
      });

      if (response.data && response.data.length > 0) {
        // Rasa returns an array of responses
        const botResponses = response.data.map(msg => msg.text).join('\n\n');
        console.log('📥 Rasa response:', botResponses.substring(0, 100) + '...');
        return botResponses;
      } else {
        return "I'm having trouble understanding. Could you rephrase that?";
      }
    } catch (error) {
      console.error('❌ Rasa error:', error.message);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Rasa server is not running. Please start it with: cd backend/rasa-bot && rasa run --enable-api');
      }
      
      throw new Error('Failed to get response from Rasa');
    }
  }

  /**
   * Check if Rasa server is running
   * @returns {Promise<boolean>}
   */
  async isHealthy() {
    try {
      const response = await axios.get(`${RASA_URL}/`, { timeout: 3000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get Rasa server status
   * @returns {Promise<object>}
   */
  async getStatus() {
    try {
      const response = await axios.get(`${RASA_URL}/status`, { timeout: 3000 });
      return response.data;
    } catch (error) {
      return { error: 'Rasa server not reachable' };
    }
  }
}

module.exports = new RasaService();
