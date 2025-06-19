// controllers/userController.js
const User = require('../models/User');

// @desc    Get all users for search
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res) => {
  try {
    // Find all users except current user
    const users = await User.find(
      { _id: { $ne: req.user._id } }, // Exclude current user
      { password: 0 } // Don't return passwords
    ).sort({ username: 1 }); // Sort alphabetically by username

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching users'
    });
  }
};