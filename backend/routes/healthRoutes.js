const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Disease = require('../models/Disease');
const Vaccination = require('../models/Vaccination');

/**
 * Health Check Endpoint - Keep server alive
 * Used by UptimeRobot and monitoring services
 */
router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'OK',
      uptime: process.uptime(),
      timestamp: Date.now(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
      }
    };
    
    res.status(200).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      message: error.message
    });
  }
});

/**
 * Simple Ping Endpoint
 */
router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

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
