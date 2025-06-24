// src/lib/socket.ts
import io from 'socket.io-client';

// Get socket URL from environment variables
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance with default configuration
export const createSocket = (userId?: string) => {
  const socket = io(SOCKET_URL, {
    query: { userId },
    transports: ['websocket', 'polling'],
  });

  // Socket event handlers
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

// Export the socket URL for other uses
export { SOCKET_URL };
