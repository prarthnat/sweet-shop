const { body, query, param, validationResult } = require('express-validator');
const Sweet = require('../models/Sweet');
const Purchase = require('../models/Purchase');

// Validation rules for creating/updating sweets
const sweetValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('category')
    .isIn(['Chocolate', 'Gummy', 'Hard Candy', 'Lollipop', 'Fudge', 'Toffee', 'Other'])
    .withMessage('Invalid category'),
  
  body('price')
    .isFloat({ min: 0.01, max: 999.99 })
    .withMessage('Price must be between $0.01 and $999.99'),
  
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
];

// Validation for search parameters
const searchValidation = [
  query('name').optional().trim(),
  query('category').optional().isIn(['Chocolate', 'Gummy', 'Hard Candy', 'Lollipop', 'Fudge', 'Toffee', 'Other']),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
];

// Validation for purchase
const purchaseValidation = [
  param('id').isMongoId().withMessage('Invalid sweet ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
];

// Validation for restock
const restockValidation = [
  param('id').isMongoId().withMessage('Invalid sweet ID'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer')
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

// Get all sweets
const getAllSweets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sweets = await Sweet.find()
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Sweet.countDocuments();

    res.json({
      status: 'success',
      results: sweets.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: sweets
    });

  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching sweets'
    });
  }
};

// Search sweets
const searchSweets = async (req, res) => {
  try {
    const sweets = await Sweet.search(req.query);
    
    res.json({
      status: 'success',
      results: sweets.length,
      data: sweets
    });

  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while searching sweets'
    });
  }
};

// Get single sweet
const getSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findById(req.params.id).populate('createdBy', 'username');

    if (!sweet) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sweet not found'
      });
    }

    res.json({
      status: 'success',
      data: sweet
    });

  } catch (error) {
    console.error('Get sweet error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching sweet'
    });
  }
};

// Create new sweet (Admin only)
const createSweet = async (req, res) => {
  try {
    const sweetData = {
      ...req.body,
      createdBy: req.user._id
    };

    const sweet = new Sweet(sweetData);
    await sweet.save();

    // Populate creator info
    await sweet.populate('createdBy', 'username');

    res.status(201).json({
      status: 'success',
      message: 'Sweet created successfully',
      data: sweet
    });

  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while creating sweet'
    });
  }
};

// Update sweet (Admin only)
const updateSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    ).populate('createdBy', 'username');

    if (!sweet) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sweet not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Sweet updated successfully',
      data: sweet
    });

  } catch (error) {
    console.error('Update sweet error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error while updating sweet'
    });
  }
};

// Delete sweet (Admin only)
const deleteSweet = async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);

    if (!sweet) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sweet not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Sweet deleted successfully'
    });

  } catch (error) {
    console.error('Delete sweet error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error while deleting sweet'
    });
  }
};

// Purchase sweet
const purchaseSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweetId = req.params.id;
    const userId = req.user._id;

    // Find the sweet
    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sweet not found'
      });
    }

    // Check if purchase is valid
    if (!sweet.canPurchase(quantity)) {
      return res.status(400).json({
        status: 'fail',
        message: quantity > sweet.quantity 
          ? `Only ${sweet.quantity} items available in stock` 
          : 'Invalid purchase quantity'
      });
    }

    // Create purchase record
    const purchase = new Purchase({
      userId,
      sweetId,
      quantity
    });

    // Use transaction to ensure consistency
    const session = await Sweet.startSession();
    
    try {
      await session.withTransaction(async () => {
        // Save purchase
        await purchase.save({ session });
        
        // Update sweet quantity
        await sweet.purchase(quantity);
        await sweet.save({ session });
      });

      await session.endSession();

      // Populate purchase data for response
      await purchase.populate('sweetId', 'name category imageUrl');

      res.status(201).json({
        status: 'success',
        message: 'Purchase completed successfully',
        data: {
          purchase,
          remainingStock: sweet.quantity
        }
      });

    } catch (transactionError) {
      await session.endSession();
      throw transactionError;
    }

  } catch (error) {
    console.error('Purchase sweet error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error during purchase'
    });
  }
};

// Restock sweet (Admin only)
const restockSweet = async (req, res) => {
  try {
    const { quantity } = req.body;
    const sweetId = req.params.id;

    const sweet = await Sweet.findById(sweetId);

    if (!sweet) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sweet not found'
      });
    }

    // Restock the sweet
    await sweet.restock(quantity);

    res.json({
      status: 'success',
      message: `Successfully restocked ${quantity} units`,
      data: {
        sweetId: sweet._id,
        name: sweet.name,
        newQuantity: sweet.quantity
      }
    });

  } catch (error) {
    console.error('Restock sweet error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid sweet ID'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Internal server error during restocking'
    });
  }
};

// Get user's purchase history
const getPurchaseHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const purchases = await Purchase.getUserPurchases(req.user._id, page, limit);
    const total = await Purchase.countDocuments({ userId: req.user._id });

    res.json({
      status: 'success',
      results: purchases.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: purchases
    });

  } catch (error) {
    console.error('Get purchase history error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching purchase history'
    });
  }
};

// Get sweet statistics (Admin only)
const getSweetStats = async (req, res) => {
  try {
    const sweetId = req.params.id;
    
    const sweet = await Sweet.findById(sweetId);
    
    if (!sweet) {
      return res.status(404).json({
        status: 'fail',
        message: 'Sweet not found'
      });
    }

    const stats = await Purchase.getPurchaseStats(sweetId);
    
    res.json({
      status: 'success',
      data: {
        sweet: {
          id: sweet._id,
          name: sweet.name,
          currentStock: sweet.quantity
        },
        statistics: stats[0] || {
          totalQuantitySold: 0,
          totalRevenue: 0,
          purchaseCount: 0,
          averageQuantityPerPurchase: 0
        }
      }
    });

  } catch (error) {
    console.error('Get sweet stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while fetching statistics'
    });
  }
};

module.exports = {
  getAllSweets,
  searchSweets: [searchValidation, handleValidationErrors, searchSweets],
  getSweet,
  createSweet: [sweetValidation, handleValidationErrors, createSweet],
  updateSweet: [sweetValidation, handleValidationErrors, updateSweet],
  deleteSweet,
  purchaseSweet: [purchaseValidation, handleValidationErrors, purchaseSweet],
  restockSweet: [restockValidation, handleValidationErrors, restockSweet],
  getPurchaseHistory,
  getSweetStats
};