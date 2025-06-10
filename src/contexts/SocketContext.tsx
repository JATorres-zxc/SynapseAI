
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'voice' | 'file';
  timestamp: Date;
  chatId: string;
}

interface SocketContextType {
  messages: Message[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  isConnected: boolean;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Simulate socket connection
    setIsConnected(true);
    setOnlineUsers(['user1', 'user2', 'user3']);

    // Load mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user2',
        senderName: 'John Doe',
        content: 'Hey there! How are you doing?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        chatId: 'chat1'
      },
      {
        id: '2',
        senderId: 'user1',
        senderName: 'You',
        content: "I'm doing great! Thanks for asking. How about you?",
        type: 'text',
        timestamp: new Date(Date.now() - 3500000),
        chatId: 'chat1'
      }
    ];
    
    setMessages(mockMessages);
  }, []);

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // TODO: Emit to actual socket server
    console.log('Sending message:', newMessage);
  };

  return (
    <SocketContext.Provider value={{ messages, sendMessage, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
