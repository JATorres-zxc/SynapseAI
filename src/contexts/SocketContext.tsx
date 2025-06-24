// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { createSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';

type SocketType = ReturnType<typeof createSocket>;

const SocketContext = createContext<SocketType | null>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Only create socket when user is authenticated
    if (!user?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Create socket with user ID
    const newSocket = createSocket(user._id);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user?._id]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
