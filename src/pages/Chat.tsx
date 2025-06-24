import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { setupTour } from '@/lib/tour';

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('chat1');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { user } = useAuth(); // 🔑 get current logged-in user
  const socket = useSocket(); // Use socket from context

  // 🧠 Setup socket events when socket and user are available
  useEffect(() => {
    if (!socket || !user?._id) return;

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('onlineUsers', (users: string[]) => {
      console.log('Received online users:', users);
      setOnlineUsers(users);
    });

    // Request online users when component mounts
    socket.emit('getOnlineUsers');

    return () => {
      socket.off('connect');
      socket.off('onlineUsers');
    };
  }, [socket, user?._id]);

  const handleChatSelect = (chatId: string, user: User | null) => {
    setSelectedChatId(chatId);
    setSelectedUser(user);
  };

  return (
    <div className="h-screen flex bg-background" id="app-container">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect}
      />
      <ChatArea 
        chatId={selectedChatId}
        selectedUser={selectedUser}
        onMenuClick={() => setIsSidebarOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onlineUsers={onlineUsers}
      />
    </div>
  );
};

export default Chat;
