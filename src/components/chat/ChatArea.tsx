
import React from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatAreaProps {
  chatId: string;
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chatId, onMenuClick, isSidebarOpen }) => {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ChatHeader chatId={chatId} onMenuClick={onMenuClick} />
      <MessageList chatId={chatId} />
      <MessageInput chatId={chatId} />
    </div>
  );
};

export default ChatArea;
