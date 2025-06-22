const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
} = require('../controllers/authController');

// Public routes (no auth required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (auth required)
router.post('/logout', protect, logoutUser); // Logout requires valid token
router.get('/me', protect, getMe); // Fetch user data requires auth

module.exports = router;