const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const location = req.query.location;
  // Mock alert
  res.json({
    location: location || 'all',
    alerts: [
      { disease: 'Flu', severity: 'Low', message: 'Seasonal flu cases on the rise.' }
    ]
  });
});

module.exports = router;
