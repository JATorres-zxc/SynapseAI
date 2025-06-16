// socket/index.js
const Message = require('../models/Message');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join a conversation
    socket.on('joinConversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User joined conversation: ${conversationId}`);
    });

    // Send and save message
    socket.on('sendMessage', async (data) => {
      try {
        const { sender, recipient, content } = data;
        
        // Save to database
        const message = new Message({
          sender,
          recipient,
          content
        });
        await message.save();

        // Emit to recipient
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

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};