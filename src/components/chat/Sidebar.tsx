import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, Moon, Sun, Plus, MessageSquare, Users, User, Search } from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';
import SearchModal from '@/components/search/SearchModal';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChatId: string;
  onChatSelect: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, selectedChatId, onChatSelect }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const mockChats = [
    { id: 'chat1', name: 'John Doe', lastMessage: 'Hey there!', type: 'direct', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { id: 'chat2', name: 'Work Team', lastMessage: 'Meeting at 3pm', type: 'group', avatar: null },
    { id: 'chat3', name: 'Sarah Wilson', lastMessage: 'Thanks for the help!', type: 'direct', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face' },
    { id: 'chat4', name: 'Project Alpha', lastMessage: 'New updates available', type: 'group', avatar: null },
  ];

  if (isMobile && !isOpen) return null;

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      <div className={`
        ${isMobile ? 'fixed left-0 top-0 z-50' : 'relative'} 
        h-full w-80 bg-card border-r border-border flex flex-col
        ${isMobile && isOpen ? 'animate-slide-in' : ''}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">ChatApp</h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchModal(true)}
                className="rounded-xl"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowProfileModal(true)}
                className="rounded-xl"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="rounded-xl"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 p-3 bg-accent rounded-xl">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.username?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.username}</p>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button className="w-full rounded-xl" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pt-0">
          <div className="space-y-2">
            {mockChats.map((chat) => (
              <Card
                key={chat.id}
                className={`p-3 cursor-pointer transition-all duration-200 hover:bg-accent ${
                  selectedChatId === chat.id ? 'bg-primary text-primary-foreground' : ''
                }`}
                onClick={() => {
                  onChatSelect(chat.id);
                  if (isMobile) onClose();
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {chat.avatar ? (
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {chat.type === 'group' ? (
                          <Users className="h-6 w-6 text-primary" />
                        ) : (
                          <MessageSquare className="h-6 w-6 text-primary" />
                        )}
                      </div>
                    )}
                    {chat.type === 'direct' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{chat.name}</p>
                      <span className="text-xs text-muted-foreground">2m</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
      
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        currentChatId={selectedChatId}
      />
    </>
  );
};

export default Sidebar;
