const express = require('express');
const router = express.Router();
const Disease = require('../models/Disease');
const Vaccination = require('../models/Vaccination');

router.get('/:disease', async (req, res) => {
  try {
    const disease = await Disease.findOne({ name: new RegExp(req.params.disease, 'i') });
    if (disease) {
      res.json(disease);
    } else {
      res.status(404).json({ message: 'Disease information not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/vaccines/:ageGroup', async (req, res) => {
  try {
    const schedule = await Vaccination.findOne({ age_group: req.params.ageGroup });
    if (schedule) {
      res.json(schedule);
    } else {
      res.status(404).json({ message: 'Vaccination schedule not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
