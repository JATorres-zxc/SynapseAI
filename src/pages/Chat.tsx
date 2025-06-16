import React, { useState } from 'react';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';
import { User } from '@/types/user';

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('chat1');
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Add this state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  const handleChatSelect = (chatId: string, user: User | null) => {
    setSelectedChatId(chatId);
    setSelectedUser(user); // Update the user state
  };

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedChatId={selectedChatId}
        onChatSelect={handleChatSelect} // Use the new handler
      />
      <ChatArea 
        chatId={selectedChatId}
        selectedUser={selectedUser} // Pass the selected user
        onMenuClick={() => setIsSidebarOpen(true)}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Chat;
