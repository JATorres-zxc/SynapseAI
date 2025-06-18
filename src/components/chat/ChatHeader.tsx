import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, Bell } from 'lucide-react';
import { User } from '@/types/user';

interface ChatHeaderProps {
  chatId: string;
  selectedUser: User | null;
  onMenuClick: () => void;
  isOnline: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  chatId, 
  selectedUser, 
  onMenuClick, 
  isOnline
}) => {
  const isMobile = useIsMobile();

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
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {selectedUser?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div
            className={`
              absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background
              ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
            `}
          />
        </div>
        <div>
          <h2 className="font-semibold">
            {selectedUser?.username || 'Select a user'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {selectedUser?.email || 'No user selected'}
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
