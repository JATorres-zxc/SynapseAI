// src/lib/socket.ts
import io from 'socket.io-client';

let userId = ''; // default empty

// Export a function to init socket with userId
export const initSocket = (id: string) => {
  userId = id;
  return io('http://localhost:5000', {
    query: { userId }
  });
};
