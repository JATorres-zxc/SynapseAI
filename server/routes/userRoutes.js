const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { getAllUsers } = require('../controllers/userController');

router.get('/', protect, getAllUsers); // Changed from '/users' to '/' since it's already mounted at '/api/users'

module.exports = router; // THIS LINE WAS MISSING