const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Users can only view their own profile unless they're admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this user'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete all tasks associated with the user
    await Task.deleteMany({ user: req.params.id });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User and associated tasks deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (Admin only)
// @route   PATCH /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either user or admin'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from changing their own role
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change your own role'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get task statistics
    const taskStats = await Task.getUserStats(userId);

    // Get additional user stats
    const totalTasks = await Task.countDocuments({ 
      user: userId, 
      isArchived: false 
    });

    const completedTasks = await Task.countDocuments({
      user: userId,
      status: 'completed',
      isArchived: false
    });

    const pendingTasks = await Task.countDocuments({
      user: userId,
      status: 'pending',
      isArchived: false
    });

    const inProgressTasks = await Task.countDocuments({
      user: userId,
      status: 'in-progress',
      isArchived: false
    });

    const overdueTasks = await Task.countDocuments({
      user: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' },
      isArchived: false
    });

    // Get tasks created this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const tasksThisMonth = await Task.countDocuments({
      user: userId,
      createdAt: { $gte: startOfMonth },
      isArchived: false
    });

    // Get tasks completed this month
    const completedThisMonth = await Task.countDocuments({
      user: userId,
      status: 'completed',
      completedAt: { $gte: startOfMonth },
      isArchived: false
    });

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalTasks,
          completedTasks,
          pendingTasks,
          inProgressTasks,
          overdueTasks,
          tasksThisMonth,
          completedThisMonth,
          completionRate: Math.round(completionRate * 100) / 100
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  updateUserRole,
  getUserStats
};
