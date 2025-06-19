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

// @desc    Update user profile
// @route   PUT /api/auth/update
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { username } = req.body;

    // Validate input
    if (!username || username.trim().length < 3) {
      return res.status(400).json({ 
        success: false,
        message: 'Username must be at least 3 characters' 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { username },
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update error:', error);
    
    // Handle duplicate username error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during update'
    });
  }
};

// @desc    Deactivate user account
// @route   POST /api/auth/deactivate
// @access  Private
exports.deactivateUser = async (req, res) => {
  try {
    // In production, you might want to soft delete instead
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Clear session
    req.session.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during deactivation'
    });
  }
};
