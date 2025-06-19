const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Chat = require('../models/Chat');

// Create or get existing chat
router.post('/', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      $or: [
        { user1: req.user._id, user2: recipientId },
        { user1: recipientId, user2: req.user._id }
      ]
    }).populate('user1 user2', 'username email');

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const newChat = new Chat({
      user1: req.user._id,
      user2: recipientId
    });

    await newChat.save();
    const populatedChat = await Chat.populate(newChat, {
      path: 'user1 user2',
      select: 'username email'
    });

    res.status(201).json(populatedChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;