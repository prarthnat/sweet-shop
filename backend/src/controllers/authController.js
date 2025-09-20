const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Validation rules for registration
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Validation rules for login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

// Register new user
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email },
        { username: username }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        status: 'fail',
        message: `User with this ${field} already exists`
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: 'fail',
        message: `User with this ${field} already exists`
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error during registration'
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      status: 'success',
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during login'
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    res.json({
      status: 'success',
      user
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching profile'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user._id;

    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: userId }
      });

      if (existingUser) {
        return res.status(400).json({
          status: 'fail',
          message: 'Username is already taken'
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username },
      { 
        new: true,
        runValidators: true
      }
    );

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error during profile update'
    });
  }
};

// Logout (client-side token removal, but we can log it)
const logout = (req, res) => {
  res.json({
    status: 'success',
    message: 'Logout successful'
  });
};

module.exports = {
  register: [registerValidation, handleValidationErrors, register],
  login: [loginValidation, handleValidationErrors, login],
  getProfile,
  updateProfile,
  logout
};