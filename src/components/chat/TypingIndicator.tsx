
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  chatId: string;
  typingUsers: Array<{
    userId: string;
    userName: string;
    chatId: string;
  }>;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ chatId, typingUsers }) => {
  const currentChatTypingUsers = typingUsers.filter(user => user.chatId === chatId);
  
  if (currentChatTypingUsers.length === 0) return null;

  const getTypingText = () => {
    const count = currentChatTypingUsers.length;
    if (count === 1) {
      return `${currentChatTypingUsers[0].userName} is typing...`;
    }
    if (count === 2) {
      return `${currentChatTypingUsers[0].userName} and ${currentChatTypingUsers[1].userName} are typing...`;
    }
    return `${currentChatTypingUsers[0].userName} and ${count - 1} others are typing...`;
  };

  return (
    <div className="flex items-center gap-2 p-4 animate-fade-in">
      <div className="flex -space-x-2">
        {currentChatTypingUsers.slice(0, 3).map((user, index) => (
          <Avatar key={user.userId} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`} />
            <AvatarFallback className="text-xs">{user.userName[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{getTypingText()}</span>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
