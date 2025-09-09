const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a task description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot be more than 20 characters']
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must belong to a user']
  },
  completedAt: {
    type: Date
  },
  isArchived: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtuals
taskSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24)); // days
});

taskSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

// Indexes
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, dueDate: 1 });
taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ user: 1, status: 1, priority: 1, createdAt: -1 });

// Pre-save middleware
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.isModified('status') && this.status !== 'completed') {
    this.completedAt = undefined;
  }
  next();
});

// Static method to get user stats
taskSchema.statics.getUserStats = async function(userId, status) {
  let matchUserId = userId;

  // Handle userId: convert string to ObjectId if valid, else throw error
  if (typeof userId === 'string' && mongoose.Types.ObjectId.isValid(userId)) {
    matchUserId = new mongoose.Types.ObjectId(userId);
  } else if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const matchStage = { user: matchUserId, isArchived: false };
  if (status) matchStage.status = status;

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const result = {
    total: 0,
    pending: 0,
    'in-progress': 0,
    completed: 0
  };

  stats.forEach(stat => {
    result[stat._id] = stat.count;
    result.total += stat.count;
  });

  return result;
};

// Instance methods
taskSchema.methods.canModify = function(userId) {
  return this.user.toString() === userId.toString();
};

taskSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    status: this.status,
    priority: this.priority,
    dueDate: this.dueDate,
    isOverdue: this.isOverdue,
    age: this.age,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Task', taskSchema);