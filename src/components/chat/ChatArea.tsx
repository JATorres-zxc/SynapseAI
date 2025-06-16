import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { User } from '@/types/user';

interface ChatAreaProps {
  chatId: string;
  selectedUser: User | null; // Add this prop
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  chatId, 
  selectedUser, 
  onMenuClick, 
  isSidebarOpen 
}) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader 
        chatId={chatId}
        selectedUser={selectedUser} // Pass it down
        onMenuClick={onMenuClick} 
      />
      <MessageList chatId={chatId} />
      <MessageInput chatId={chatId} />
    </div>
  );
};

export default ChatArea;
