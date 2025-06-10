
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Bell, Users } from 'lucide-react';

interface ChatHeaderProps {
  chatId: string;
  onMenuClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId, onMenuClick }) => {
  const isMobile = useIsMobile();

  const getChatInfo = (id: string) => {
    const chats = {
      'chat1': { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', type: 'direct' },
      'chat2': { name: 'Work Team', avatar: null, type: 'group' },
      'chat3': { name: 'Sarah Wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face', type: 'direct' },
      'chat4': { name: 'Project Alpha', avatar: null, type: 'group' },
    };
    return chats[id as keyof typeof chats] || chats['chat1'];
  };

  const chat = getChatInfo(chatId);

  return (
    <div className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="rounded-xl"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="relative">
          {chat.avatar ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.avatar} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          )}
          {chat.type === 'direct' && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
          )}
        </div>
        <div>
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-sm text-muted-foreground">
            {chat.type === 'direct' ? 'Online' : '5 members'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
