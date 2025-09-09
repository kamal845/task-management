const Task = require('../models/Task');
const mongoose = require('mongoose');
// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build query
    const query = { 
      user: req.user.id,
      isArchived: false
    };

    // Add filters
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Add search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const tasks = await Task.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      },
      data: {
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user owns the task
    if (!task.canModify(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user owns the task
    if (!task.canModify(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user owns the task
    if (!task.canModify(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    console.log('req.user:', req.user); // req.user ka pura object
    const userId = req.user?._id || req.user?.id;
    console.log('userId raw:', userId, 'Type:', typeof userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }

    const matchStage = { user: new mongoose.Types.ObjectId(userId), isArchived: false };
    console.log('matchStage for aggregation:', matchStage);

    const stats = await Task.getUserStats(userId);
    console.log('stats from aggregation:', stats);

    const totalTasks = await Task.countDocuments({ user: userId, isArchived: false });
    console.log('totalTasks:', totalTasks);

    res.status(200).json({
      success: true,
      data: {
        stats: { ...stats, total: totalTasks }
      }
    });
  } catch (error) {
    console.error('Error in getTaskStats:', error);
    next(error);
  }
};


// @desc    Search tasks
// @route   GET /api/tasks/search
// @access  Private
const searchTasks = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const query = {
      user: req.user.id,
      isArchived: false,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      data: {
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tasks by status
// @route   GET /api/tasks/status/:status
// @access  Private
const getTasksByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const query = {
      user: req.user.id,
      status,
      isArchived: false
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      data: {
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
const getOverdueTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = {
      user: req.user.id,
      dueDate: { $lt: new Date() },
      status: { $ne: 'completed' },
      isArchived: false
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      data: {
        tasks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive task
// @route   PATCH /api/tasks/:id/archive
// @access  Private
const archiveTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!task.canModify(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to archive this task'
      });
    }

    task.isArchived = true;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task archived successfully',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unarchive task
// @route   PATCH /api/tasks/:id/unarchive
// @access  Private
const unarchiveTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (!task.canModify(req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to unarchive this task'
      });
    }

    task.isArchived = false;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task unarchived successfully',
      data: {
        task
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
  searchTasks,
  getTasksByStatus,
  getOverdueTasks,
  archiveTask,
  unarchiveTask
};
