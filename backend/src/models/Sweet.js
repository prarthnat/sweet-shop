const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Sweet name is required'],
    trim: true,
    minlength: [2, 'Sweet name must be at least 2 characters long'],
    maxlength: [100, 'Sweet name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Chocolate', 'Gummy', 'Hard Candy', 'Lollipop', 'Fudge', 'Toffee', 'Other'],
      message: 'Category must be one of: Chocolate, Gummy, Hard Candy, Lollipop, Fudge, Toffee, Other'
    }
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0.01, 'Price must be greater than 0'],
    max: [999.99, 'Price cannot exceed $999.99']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty string
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Image URL must be a valid image URL'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
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
sweetSchema.index({ name: 'text', description: 'text' }); // Text search
sweetSchema.index({ category: 1 });
sweetSchema.index({ price: 1 });
sweetSchema.index({ createdAt: -1 });
sweetSchema.index({ quantity: 1 });

// Virtual for availability status
sweetSchema.virtual('isAvailable').get(function() {
  return this.quantity > 0;
});

// Static method to search sweets
sweetSchema.statics.search = function(searchParams) {
  const { name, category, minPrice, maxPrice, page = 1, limit = 10 } = searchParams;
  
  let query = {};
  
  // Text search on name and description
  if (name) {
    query.$or = [
      { name: { $regex: name, $options: 'i' } },
      { description: { $regex: name, $options: 'i' } }
    ];
  }
  
  // Category filter
  if (category) {
    query.category = category;
  }
  
  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  
  const skip = (page - 1) * limit;
  
  return this.find(query)
    .populate('createdBy', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));
};

// Instance method to check if purchase is valid
sweetSchema.methods.canPurchase = function(quantity) {
  return this.quantity >= quantity && quantity > 0;
};

// Instance method to purchase sweet
sweetSchema.methods.purchase = function(quantity) {
  if (!this.canPurchase(quantity)) {
    throw new Error('Insufficient stock or invalid quantity');
  }
  
  this.quantity -= quantity;
  return this.save();
};

// Instance method to restock sweet
sweetSchema.methods.restock = function(quantity) {
  if (quantity <= 0) {
    throw new Error('Restock quantity must be positive');
  }
  
  this.quantity += quantity;
  return this.save();
};

// Pre-save middleware to round price to 2 decimal places
sweetSchema.pre('save', function(next) {
  if (this.isModified('price')) {
    this.price = Math.round(this.price * 100) / 100;
  }
  next();
});

module.exports = mongoose.model('Sweet', sweetSchema);