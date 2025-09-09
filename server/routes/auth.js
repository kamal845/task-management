const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordUpdate
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.use(protect); // All routes below this middleware are protected

router.get('/me', getMe);
router.put('/update-profile', updateProfile);
router.put('/update-password', validatePasswordUpdate, updatePassword);
router.post('/logout', logout);

module.exports = router;
