const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  state: { type: String, default: 'START' }, // START, COLLECTING_SYMPTOMS, ADVISING
  symptoms: [String],
  language: { type: String, default: 'en' },
  lastActivity: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversation', ConversationSchema);
