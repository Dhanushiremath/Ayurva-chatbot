const admin = require('firebase-admin');

/**
 * Initialize Firebase Admin SDK
 * 
 * To use Firebase, you need to:
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new project or select existing one
 * 3. Go to Project Settings > Service Accounts
 * 4. Click "Generate New Private Key"
 * 5. Save the JSON file as 'firebase-service-account.json' in backend/config/
 * 6. Update .env with FIREBASE_ENABLED=true
 */

let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized || admin.apps.length > 0) {
    return true;
  }

  try {
    // Check if Firebase is enabled
    if (process.env.FIREBASE_ENABLED !== 'true') {
      console.log('Firebase is disabled. Set FIREBASE_ENABLED=true in .env to enable.');
      return false;
    }

    // Try to load service account from file
    const serviceAccount = require('./firebase-service-account.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });

    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized successfully');
    return true;
  } catch (error) {
    console.log('⚠️  Firebase not configured:', error.message);
    console.log('   Push notifications will be disabled.');
    console.log('   To enable: Add firebase-service-account.json to backend/config/');
    return false;
  }
};

/**
 * Send push notification to a device
 * @param {String} token - FCM device token
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Additional data payload
 */
const sendPushNotification = async (token, title, body, data = {}) => {
  if (!firebaseInitialized) {
    console.log('Firebase not initialized. Skipping notification.');
    return { success: false, reason: 'Firebase not configured' };
  }

  const message = {
    notification: {
      title,
      body
    },
    data,
    token
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('✅ Push notification sent:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('❌ Error sending push notification:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send notification to multiple devices
 * @param {Array} tokens - Array of FCM device tokens
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 */
const sendMulticastNotification = async (tokens, title, body) => {
  if (!firebaseInitialized) {
    console.log('Firebase not initialized. Skipping notifications.');
    return { success: false, reason: 'Firebase not configured' };
  }

  const message = {
    notification: {
      title,
      body
    },
    tokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`✅ Sent ${response.successCount} notifications successfully`);
    if (response.failureCount > 0) {
      console.log(`⚠️  ${response.failureCount} notifications failed`);
    }
    return response;
  } catch (error) {
    console.error('❌ Error sending multicast notification:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  initializeFirebase,
  sendPushNotification,
  sendMulticastNotification,
  isInitialized: () => firebaseInitialized
};
