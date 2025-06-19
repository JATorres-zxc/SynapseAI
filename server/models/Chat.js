const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for faster lookup
chatSchema.index({ user1: 1, user2: 1 }, { unique: true });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;