const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * Health Check Endpoint
 * Used by UptimeRobot and monitoring services to keep server alive
 */
router.get('/health', async (req, res) => {
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
 * Lightweight alternative for keep-alive pings
 */
router.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

module.exports = router;
