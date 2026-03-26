const express = require('express');
const router = express.Router();
const hospitalService = require('../services/hospital-service');

/**
 * GET /api/hospitals/nearby
 * Find hospitals near a specific location
 * Query params: lat, lon, radius
 */
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and Longitude are required' });
    }

    const hospitals = await hospitalService.findNearbyHospitals(
      parseFloat(lat), 
      parseFloat(lon), 
      radius ? parseInt(radius) : 5000
    );

    res.json(hospitals);
  } catch (error) {
    console.error('Nearby Hospitals Route Error:', error);
    res.status(500).json({ error: 'Failed to fetch nearby hospitals' });
  }
});

module.exports = router;
