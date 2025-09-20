const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  sweetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sweet',
    required: [true, 'Sweet ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0.01, 'Total price must be greater than 0']
  },
  sweetSnapshot: {
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    priceAtPurchase: {
      type: Number,
      required: true
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better query performance
purchaseSchema.index({ userId: 1, createdAt: -1 });
purchaseSchema.index({ sweetId: 1 });
purchaseSchema.index({ createdAt: -1 });

// Static method to get user's purchase history
purchaseSchema.statics.getUserPurchases = function(userId, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ userId })
    .populate('sweetId', 'name category imageUrl')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
};

// Static method to get purchase statistics
purchaseSchema.statics.getPurchaseStats = function(sweetId) {
  return this.aggregate([
    { $match: { sweetId: mongoose.Types.ObjectId(sweetId) } },
    {
      $group: {
        _id: null,
        totalQuantitySold: { $sum: '$quantity' },
        totalRevenue: { $sum: '$totalPrice' },
        purchaseCount: { $sum: 1 },
        averageQuantityPerPurchase: { $avg: '$quantity' }
      }
    }
  ]);
};

// Pre-save middleware to calculate total price and create snapshot
purchaseSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      // Get sweet details for snapshot and price calculation
      const Sweet = mongoose.model('Sweet');
      const sweet = await Sweet.findById(this.sweetId);
      
      if (!sweet) {
        throw new Error('Sweet not found');
      }
      
      // Calculate total price
      this.totalPrice = Math.round(sweet.price * this.quantity * 100) / 100;
      
      // Create snapshot of sweet at purchase time
      this.sweetSnapshot = {
        name: sweet.name,
        category: sweet.category,
        priceAtPurchase: sweet.price
      };
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('Purchase', purchaseSchema);