import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { LogOut, Moon, Sun, Plus, MessageSquare, Users, User as UserIcon, Search, Bot } from 'lucide-react';
import ProfileModal from '@/components/ProfileModal';
import SearchModal from '@/components/search/SearchModal';
import ChatbotModal from '@/components/chat/ChatbotModal';
import axios from 'axios';
import { User } from '@/types/user';
import { initSocket } from '@/lib/socket';
// interface User {
//   _id: string;
//   username: string;
//   email: string;
//   createdAt: string;
// }

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedChatId: string;
  onChatSelect: (chatId: string, user: User | null) => void; // Updated
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, selectedChatId, onChatSelect }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [allUsers, setAllUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get<User[]>('/api/users');
        console.log('API Response:', response);
        setAllUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();

    // Only initialize socket if user is ready
    if (!user?._id) return;

    const newSocket = initSocket(user._id);
    newSocket.emit('getOnlineUsers');

    newSocket.on('onlineUsers', (onlineUserIds: string[]) => {
      setOnlineUsers(onlineUserIds);
    });

    return () => {
      newSocket.disconnect(); // Clean up connection on unmount
    };
  }, [user?._id]);

  const handleUserSelect = (userId: string) => {
    const selectedUser = allUsers?.find(user => user._id === userId) || null;
    onChatSelect(userId, selectedUser); // Update this to pass the user object
    if (isMobile) onClose();
  };

  if (isMobile && !isOpen) return null;

  const handleStartChat = async (userId: string) => {
    try {
      // 1. Find or create a chat with this user
      const response = await axios.post('/api/chats', {
        recipientId: userId
      });

      // 2. Navigate to the chat
      const selectedUser = allUsers?.find(user => user._id === userId) || null;
      onChatSelect(response.data._id, selectedUser);
      
      // 3. Close sidebar on mobile
      if (isMobile) onClose();
    } catch (error) {
      console.error('Error starting chat:', error);
      // Handle error (show toast, etc.)
    }
  };

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
        {/* Header - unchanged */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-primary">Synapse</h1>
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
                <UserIcon className="h-4 w-4" />
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

        {/* Users List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pt-0">
          {allUsers === null ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading users...</p>
            </div>
          ) : allUsers?.length === 0 ? (
            <div className="flex justify-center items-center h-full">
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {allUsers?.map((user) => {
                const isOnline = onlineUsers.includes(user._id);

                return (
                  <Card
                    key={user._id}
                    className={`p-3 cursor-pointer transition-all duration-200 hover:bg-accent ${
                      selectedChatId === user._id ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleUserSelect(user._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div
                          className={`
                            absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background
                            ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
                          `}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{user.username}</p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Chatbot Button */}
        <div className="p-4 border-t border-border">
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => setShowChatbotModal(true)}
          >
            <Bot className="h-4 w-4 mr-2" />
            Chat with AI Assistant
          </Button>
        </div>
      </div>

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
      
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        currentUserId={user?._id} // If you need this
        currentChatId={selectedChatId} // Changed from currentChatId to currentUserId if needed
        onStartChat={handleStartChat}
      />

      <ChatbotModal
        isOpen={showChatbotModal}
        onClose={() => setShowChatbotModal(false)}
      />
    </>
  );
};

export default Sidebar;
