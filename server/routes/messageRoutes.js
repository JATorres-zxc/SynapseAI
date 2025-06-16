// routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Message = require('../models/Message');

// Get messages between two users
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    }).sort('createdAt').populate('sender', 'username').populate('recipient', 'username');

    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete a message
router.delete('/:messageId', protect, async (req, res) => {
  try {
    const message = await Message.findOneAndDelete({
      _id: req.params.messageId,
      sender: req.user._id // Only sender can delete
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;