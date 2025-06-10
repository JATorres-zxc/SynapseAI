
import React, { useState } from 'react';
import Sidebar from '@/components/chat/Sidebar';
import ChatArea from '@/components/chat/ChatArea';
import { useIsMobile } from '@/hooks/use-mobile';

const Chat = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>('chat1');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const isMobile = useIsMobile();

  return (
    <div className="h-screen flex bg-background">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        selectedChatId={selectedChatId}
        onChatSelect={setSelectedChatId}
      />
      <ChatArea 
        chatId={selectedChatId}
        onMenuClick={() => setIsSidebarOpen(true)}
        isSidebarOpen={isSidebarOpen}
      />
    </div>
  );
};

export default Chat;
