import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types/user';
import { initSocket } from '@/lib/socket';
import { useAuth } from '@/contexts/AuthContext';
import { setupTour } from '@/lib/tour';

let socket: ReturnType<typeof initSocket>;

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('chat1');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { user } = useAuth(); // 🔑 get current logged-in user

  // 🧠 Setup socket only when user is available
  useEffect(() => {
    if (!user?._id) return;

    socket = initSocket(user._id); // initialize with userId

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('onlineUsers', (users: string[]) => {
      console.log('Received online users:', users);
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

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
