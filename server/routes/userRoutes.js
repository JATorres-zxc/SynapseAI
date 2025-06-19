const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getAllUsers, updateUser, deactivateUser } = require('../controllers/userController');

router.get('/', protect, getAllUsers); // Changed from '/users' to '/' since it's already mounted at '/api/users'
router.put('/update', protect, updateUser);
router.post('/deactivate', protect, deactivateUser);

module.exports = router; // THIS LINE WAS MISSING