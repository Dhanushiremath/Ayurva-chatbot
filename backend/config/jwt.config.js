const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ayurva_default_secret_change_in_production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

/**
 * Generate JWT token for user authentication
 * @param {Object} payload - User data to encode in token
 * @returns {String} JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  JWT_SECRET
};
