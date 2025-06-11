
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MessageStatus {
  sent: boolean;
  delivered: boolean;
  read: boolean;
  readBy?: string[];
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'voice' | 'file';
  timestamp: Date;
  chatId: string;
  status?: MessageStatus;
  isPinned?: boolean;
  isEdited?: boolean;
  isDeleted?: boolean;
  forwardedFrom?: {
    originalSender: string;
    originalTimestamp: Date;
    originalChatId: string;
  };
}

interface TypingIndicator {
  userId: string;
  userName: string;
  chatId: string;
}

interface SocketContextType {
  messages: Message[];
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => void;
  isConnected: boolean;
  onlineUsers: string[];
  typingUsers: TypingIndicator[];
  setTyping: (chatId: string, isTyping: boolean) => void;
  updateMessageStatus: (messageId: string, status: Partial<MessageStatus>) => void;
  readReceiptsEnabled: boolean;
  setReadReceiptsEnabled: (enabled: boolean) => void;
  pinMessage: (messageId: string) => void;
  unpinMessage: (messageId: string) => void;
  forwardMessage: (messageId: string, targetChatId: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  getPinnedMessages: (chatId: string) => Message[];
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
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(true);

  useEffect(() => {
    // Simulate socket connection
    setIsConnected(true);
    setOnlineUsers(['user1', 'user2', 'user3']);

    // Load mock messages with status
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user2',
        senderName: 'John Doe',
        content: 'Hey there! How are you doing?',
        type: 'text',
        timestamp: new Date(Date.now() - 3600000),
        chatId: 'chat1',
        status: { sent: true, delivered: true, read: true, readBy: ['user1'] },
        isPinned: true
      },
      {
        id: '2',
        senderId: 'user1',
        senderName: 'You',
        content: "I'm doing great! Thanks for asking. How about you?",
        type: 'text',
        timestamp: new Date(Date.now() - 3500000),
        chatId: 'chat1',
        status: { sent: true, delivered: true, read: false }
      }
    ];
    
    setMessages(mockMessages);
  }, []);

  const sendMessage = (messageData: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
      status: { sent: true, delivered: false, read: false }
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate delivery after a short delay
    setTimeout(() => {
      updateMessageStatus(newMessage.id, { delivered: true });
    }, 1000);
    
    console.log('Sending message:', newMessage);
  };

  const setTyping = (chatId: string, isTyping: boolean) => {
    const userId = 'user1';
    const userName = 'You';
    
    if (isTyping) {
      setTypingUsers(prev => {
        const existing = prev.find(t => t.userId === userId && t.chatId === chatId);
        if (!existing) {
          return [...prev, { userId, userName, chatId }];
        }
        return prev;
      });
    } else {
      setTypingUsers(prev => prev.filter(t => !(t.userId === userId && t.chatId === chatId)));
    }
  };

  const updateMessageStatus = (messageId: string, statusUpdate: Partial<MessageStatus>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: { ...msg.status, ...statusUpdate } }
        : msg
    ));
  };

  const pinMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: true } : msg
    ));
  };

  const unpinMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isPinned: false } : msg
    ));
  };

  const forwardMessage = (messageId: string, targetChatId: string) => {
    const messageToForward = messages.find(msg => msg.id === messageId);
    if (!messageToForward) return;

    const forwardedMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user1', // Current user
      senderName: 'You',
      content: messageToForward.content,
      type: messageToForward.type,
      timestamp: new Date(),
      chatId: targetChatId,
      status: { sent: true, delivered: false, read: false },
      forwardedFrom: {
        originalSender: messageToForward.senderName,
        originalTimestamp: messageToForward.timestamp,
        originalChatId: messageToForward.chatId
      }
    };

    setMessages(prev => [...prev, forwardedMessage]);
    
    setTimeout(() => {
      updateMessageStatus(forwardedMessage.id, { delivered: true });
    }, 1000);
  };

  const editMessage = (messageId: string, newContent: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, content: newContent, isEdited: true }
        : msg
    ));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isDeleted: true, content: 'This message was deleted' }
        : msg
    ));
  };

  const getPinnedMessages = (chatId: string) => {
    return messages.filter(msg => msg.chatId === chatId && msg.isPinned && !msg.isDeleted);
  };

  return (
    <SocketContext.Provider value={{ 
      messages, 
      sendMessage, 
      isConnected, 
      onlineUsers, 
      typingUsers, 
      setTyping, 
      updateMessageStatus,
      readReceiptsEnabled,
      setReadReceiptsEnabled,
      pinMessage,
      unpinMessage,
      forwardMessage,
      editMessage,
      deleteMessage,
      getPinnedMessages
    }}>
      {children}
    </SocketContext.Provider>
  );
};
