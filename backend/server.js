const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
// Restrict CORS to known origins. Add 'https://aashutoshdahal.vercel.app' as an allowed origin.
const allowedOrigins = [
  process.env.CORS_ORIGIN || 'https://aashutoshdahal.vercel.app', 
  'http://localhost:3000',
  'http://localhost:8080',
  'http://localhost:5173'
];
app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Instead of throwing an error, reject with false to return proper CORS headers
    console.log('Origin not allowed:', origin);
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});