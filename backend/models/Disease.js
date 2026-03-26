const mongoose = require('mongoose');

const diseaseSchema = new mongoose.Schema({
  disease_id: { type: String, unique: true },
  name: String,
  symptoms: [String],
  causes: String,
  prevention: String,
  treatment: String,
  language: { type: String, default: 'en' }
});

module.exports = mongoose.model('Disease', diseaseSchema);
