import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Calendar as CalendarIcon, Filter, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentChatId: string;
}

type MessageResult = {
  id: string;
  type: 'message';
  content: string;
  sender: string;
  timestamp: Date;
  chatId: string;
  chatName: string;
};

type UserResult = {
  id: string;
  type: 'user';
  username: string;
  email: string;
  avatar: string;
  displayName: string;
};

type SearchResult = MessageResult | UserResult;

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, currentChatId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'users'>('messages');
  const [dateFilter, setDateFilter] = useState<Date>();
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  // Mock data for demonstration
  const mockMessageResults: MessageResult[] = [
    {
      id: '1',
      type: 'message',
      content: 'Hey there! How are you doing?',
      sender: 'John Doe',
      timestamp: new Date(Date.now() - 3600000),
      chatId: 'chat1',
      chatName: 'John Doe'
    },
    {
      id: '2',
      type: 'message',
      content: 'Meeting at 3pm tomorrow',
      sender: 'Sarah Wilson',
      timestamp: new Date(Date.now() - 7200000),
      chatId: 'chat2',
      chatName: 'Work Team'
    }
  ];

  const mockUserResults: UserResult[] = [
    {
      id: '1',
      type: 'user',
      username: 'john_doe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      displayName: 'John Doe'
    },
    {
      id: '2',
      type: 'user',
      username: 'sarah_wilson',
      email: 'sarah@example.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
      displayName: 'Sarah Wilson'
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    if (activeTab === 'messages') {
      const filtered = mockMessageResults.filter(result =>
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.sender.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      const filtered = mockUserResults.filter(result =>
        result.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary font-medium rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  const isMessageResult = (result: SearchResult): result is MessageResult => {
    return result.type === 'message';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search messages or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button onClick={handleSearch} className="rounded-xl">
              Search
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card className="p-4 bg-accent/50">
              <div className="flex items-center gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="rounded-xl">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {dateFilter ? format(dateFilter, 'PPP') : 'Filter by date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border-border">
                    <Calendar
                      mode="single"
                      selected={dateFilter}
                      onSelect={setDateFilter}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {dateFilter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateFilter(undefined)}
                    className="rounded-xl"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Tabs */}
            <Tabs 
              value={activeTab} 
              onValueChange={(value: string) => setActiveTab(value as 'messages' | 'users')}
              className="w-full"
            >            
              <TabsList className="grid w-full grid-cols-2 bg-accent rounded-xl">
              <TabsTrigger value="messages" className="rounded-xl">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger value="users" className="rounded-xl">
                <User className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* Message Search Results */}
            <TabsContent value="messages" className="mt-4">
              <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hide">
                {results.length === 0 && searchQuery ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No messages found for "{searchQuery}"
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Enter a search term to find messages
                  </div>
                ) : (
                  results.filter(isMessageResult).map((result) => (
                    <Card key={result.id} className="p-3 cursor-pointer hover:bg-accent transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" />
                          <AvatarFallback>{result.sender[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{result.sender}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {result.chatName}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {result.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">
                            {highlightText(result.content, searchQuery)}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* User Search Results */}
            <TabsContent value="users" className="mt-4">
              <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hide">
                {results.length === 0 && searchQuery ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found for "{searchQuery}"
                  </div>
                ) : results.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Enter a search term to find users
                  </div>
                ) : (
                  results.filter((result): result is UserResult => result.type === 'user').map((result) => (
                    <Card key={result.id} className="p-3 cursor-pointer hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={result.avatar} />
                          <AvatarFallback>{result.username[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">
                            {highlightText(result.username, searchQuery)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {highlightText(result.email, searchQuery)}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="rounded-xl">
                          Start Chat
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchModal;
