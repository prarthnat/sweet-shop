const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'fail',
        message: 'Access denied. No token provided.'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return res.status(401).json({
        status: 'fail',
        message: 'Access denied. Invalid token format.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Token is valid but user no longer exists.'
        });
      }

      // Add user to request object
      req.user = user;
      next();

    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'fail',
          message: 'Token has expired. Please login again.'
        });
      }

      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid token. Please login again.'
        });
      }

      throw jwtError;
    }

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication required'
    });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: 'fail',
      message: 'Admin access required'
    });
  }

  next();
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user) {
        req.user = user;
      }
    } catch (jwtError) {
      // Ignore JWT errors for optional auth
    }

    next();

  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

// Utility function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Utility function to verify token without middleware
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
  authenticate,
  requireAdmin,
  optionalAuth,
  generateToken,
  verifyToken
};