const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const sweetsRoutes = require('./routes/sweets');

const app = express();

// Trust proxy (important for rate limiting)
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Security middleware
app.use(helmet());
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sweets', sweetsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid input data',
      errors
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: 'fail',
      message: `${field} already exists`
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: 'Token expired'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

module.exports = app;