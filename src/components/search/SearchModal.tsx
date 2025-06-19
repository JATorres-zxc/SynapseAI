import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Search, User } from 'lucide-react';
import { User as UserType } from '@/types/user';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  currentChatId?: string;
  onStartChat: (userId: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, currentUserId, currentChatId, onStartChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('users');
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users when modal opens
  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && activeTab === 'users') {
        setIsLoading(true);
        setError(null);
        
        try {
          const response = await fetch('/api/users', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!response.ok) {
            throw new Error(response.status === 401 ? 'Please login again' : 'Failed to fetch users');
          }

          const data = await response.json();
          setUsers(data);
          setFilteredUsers(data);
        } catch (err) {
          setError(err.message);
          console.error('User search error:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUsers();
  }, [isOpen, activeTab]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(query) ||
      (user.email && user.email.toLowerCase().includes(query))
    );
    
    setFilteredUsers(filtered);
  };

  const highlightText = (text: string, query: string) => {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-primary/20 text-primary font-medium rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Users
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button onClick={handleSearch} className="rounded-xl">
              Search
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'messages' | 'users')}>
            <TabsList className="grid w-full grid-cols-2 bg-accent rounded-xl">
              <TabsTrigger value="users" className="rounded-xl">
                <User className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-4">
              {error ? (
                <div className="text-center py-8 text-destructive">
                  {error}
                </div>
              ) : isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredUsers.length === 0 && searchQuery ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found for "{searchQuery}"
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users available
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hide">
                  {filteredUsers.map((user) => (
                    <Card key={user._id} className="p-3 hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {user.username[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {highlightText(user.username, searchQuery)}
                          </p>
                          {user.email && (
                            <p className="text-sm text-muted-foreground">
                              {highlightText(user.email, searchQuery)}
                            </p>
                          )}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="rounded-xl"
                          onClick={() => {
                            onStartChat(user._id);
                            onClose();
                            console.log('Start chat with', user._id);
                          }}
                        >
                          Start Chat
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
