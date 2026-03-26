const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../config/jwt.config');

router.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    // Generate JWT token
    const token = generateToken({ 
      userId: user._id, 
      phone: user.phone 
    });
    
    res.status(201).json({ 
      user, 
      token,
      message: 'User registered successfully' 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Generate JWT token
    const token = generateToken({ 
      userId: user._id, 
      phone: user.phone 
    });
    
    res.status(200).json({ 
      user, 
      token,
      message: 'Login successful' 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
