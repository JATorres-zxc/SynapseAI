const Message = require('../models/Message');

// Use a Set to store online user IDs
const onlineUsers = new Set();

module.exports = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log('New client connected:', socket.id, 'User:', userId);

    if (userId) {
      socket.userId = userId;
      onlineUsers.add(userId);

      // Notify all clients of updated online users
      io.emit('onlineUsers', Array.from(onlineUsers));
    }

    // Join a conversation
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Send and save message
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, recipient, content } = data;

        let message = new Message({
          sender,
          recipient,
          content
        });
        await message.save();

        message = await message.populate('sender', 'username');

        io.to(recipient).emit('receiveMessage', message);
        io.to(sender).emit('messageSent', message);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Mark message as read
    socket.on('markAsRead', async (messageId) => {
      try {
        const message = await Message.findByIdAndUpdate(
          messageId,
          { read: true },
          { new: true }
        );
        if (message) {
          io.to(message.recipient).emit('messageRead', message);
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle manual request for online users
    socket.on('getOnlineUsers', () => {
      socket.emit('onlineUsers', Array.from(onlineUsers));
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('onlineUsers', Array.from(onlineUsers));
        console.log('Client disconnected:', socket.id, 'User:', socket.userId);
      }
    });
  });
};
