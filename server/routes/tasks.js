const express = require('express');
const {
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
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const {
  validateTaskCreation,
  validateTaskUpdate,
  validateObjectId,
  validateTaskQuery
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Task CRUD operations
router.route('/')
  .get(validateTaskQuery, getTasks)
  .post(validateTaskCreation, createTask);

router.route('/stats')
  .get(getTaskStats);

router.route('/search')
  .get(validateTaskQuery, searchTasks);

router.route('/status/:status')
  .get(validateTaskQuery, getTasksByStatus);

router.route('/overdue')
  .get(getOverdueTasks);

router.route('/:id')
  .get(validateObjectId, getTask)
  .put(validateObjectId, validateTaskUpdate, updateTask)
  .delete(validateObjectId, deleteTask);

router.route('/:id/archive')
  .patch(validateObjectId, archiveTask);

router.route('/:id/unarchive')
  .patch(validateObjectId, unarchiveTask);

module.exports = router;
