const mongoose = require('mongoose');

const vaccinationSchema = new mongoose.Schema({
  age_group: { type: String, required: true },
  vaccines: [{
    name: String,
    doses: Number,
    description: String
  }],
  language: { type: String, default: 'en' }
});

module.exports = mongoose.model('Vaccination', vaccinationSchema);
