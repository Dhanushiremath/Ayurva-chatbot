require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  'https://ayurva-chatbot.vercel.app',
  'https://ayurva-chatbot-lpduexqcl-hmdhanushs-projects.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Increase JSON body limit to 10MB to handle base64 image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.json({ message: 'Welcome to Ayurva API' }));

// Keep-alive ping endpoint — prevents Render free tier cold starts
app.get('/ping', (req, res) => res.json({ status: 'ok', ts: Date.now() }));

app.use('/api/health',    require('./routes/healthRoutes'));
app.use('/api/chat',      require('./routes/chatRoutes'));
app.use('/api/alerts',    require('./routes/alertRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/test',      require('./routes/testRoutes'));
app.use('/api/whatsapp',  require('./routes/whatsappWebhook'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/image-analyze', require('./routes/imageAnalyzeRoutes'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
