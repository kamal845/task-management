const express = require('express');
const {
  getUsers,
  getUser,
  deleteUser,
  updateUserRole,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.route('/')
  .get(authorize('admin'), getUsers);

router.route('/stats')
  .get(getUserStats);

router.route('/:id')
  .get(validateObjectId, getUser)
  .delete(validateObjectId, authorize('admin'), deleteUser);

router.route('/:id/role')
  .patch(validateObjectId, authorize('admin'), updateUserRole);

module.exports = router;
