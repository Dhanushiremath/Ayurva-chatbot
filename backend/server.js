require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ayurva API' });
});

// Health Routes
app.use('/api/health', require('./routes/healthRoutes'));
// Chat Routes
app.use('/api/chat', require('./routes/chatRoutes'));
// Alert Routes
app.use('/api/alerts', require('./routes/alertRoutes'));
// User Routes
app.use('/api/users', require('./routes/userRoutes'));
// Test Routes (for testing Twilio, Firebase, etc.)
app.use('/api/test', require('./routes/testRoutes'));
// WhatsApp Webhook Routes (for receiving messages from WhatsApp)
app.use('/api/whatsapp', require('./routes/whatsappWebhook'));
// Hospital Routes
app.use('/api/hospitals', require('./routes/hospitalRoutes'));

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
