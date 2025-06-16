import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { User } from '@/types/user';
import { useAuth } from '@/contexts/AuthContext';

interface ChatAreaProps {
  chatId: string;
  selectedUser: User | null;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ 
  chatId, 
  selectedUser, 
  onMenuClick, 
  isSidebarOpen 
}) => {
  const { user } = useAuth(); // <-- ✅ Get current user from context

  if (!selectedUser || !user) {
    return <div className="p-4">Select a chat to start messaging.</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader 
        chatId={chatId}
        selectedUser={selectedUser}
        onMenuClick={onMenuClick} 
      />
      <MessageList 
        userId={selectedUser._id} 
        currentUserId={user._id} 
      />
      <MessageInput 
        chatId={chatId} 
        currentUserId={user._id} 
        recipientId={selectedUser._id}
      />    
</div>
  );
};

export default ChatArea;
