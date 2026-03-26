const admin = require('firebase-admin');

class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      // In production, use service account key
      // admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase initialized (mock)');
    }
  }

  async sendPushNotification(token, title, body) {
    const message = {
      notification: { title, body },
      token: token
    };

    try {
      // const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', title);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }
}

module.exports = new FirebaseService();
