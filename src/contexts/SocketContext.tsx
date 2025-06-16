// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

type SocketType = ReturnType<typeof io>;

const SocketContext = createContext<SocketType | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
