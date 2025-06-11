
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface MentionsInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const MentionsInput: React.FC<MentionsInputProps> = ({
  value,
  onChange,
  onKeyPress,
  placeholder,
  className,
  rows = 1
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock users for group chat
  const groupMembers: User[] = [
    { id: 'user1', username: 'john_doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
    { id: 'user2', username: 'sarah_wilson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face' },
    { id: 'user3', username: 'mike_johnson' },
    { id: 'user4', username: 'emily_davis' },
    { id: 'user5', username: 'alex_smith' }
  ];

  useEffect(() => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      const hasSpace = textAfterAt.includes(' ');
      
      if (!hasSpace && textAfterAt.length >= 0) {
        const filtered = groupMembers.filter(user =>
          user.username.toLowerCase().includes(textAfterAt.toLowerCase())
        );
        
        if (filtered.length > 0) {
          setSuggestions(filtered);
          setMentionStart(lastAtIndex);
          setShowSuggestions(true);
          setSelectedIndex(0);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value]);

  const insertMention = (user: User) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const beforeMention = value.substring(0, mentionStart);
    const afterCursor = value.substring(cursorPosition);
    const newValue = `${beforeMention}@${user.username} ${afterCursor}`;
    
    onChange(newValue);
    setShowSuggestions(false);
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPosition = mentionStart + user.username.length + 2;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        insertMention(suggestions[selectedIndex]);
        return;
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
    
    onKeyPress(e);
  };

  return (
    <div className="relative">
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
        rows={rows}
      />
      
      {showSuggestions && (
        <Card className="absolute bottom-full left-0 right-0 mb-2 max-h-48 overflow-y-auto z-50 shadow-lg">
          <div className="p-2">
            <div className="text-xs text-muted-foreground mb-2 px-2">Select a user to mention:</div>
            {suggestions.map((user, index) => (
              <div
                key={user.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                  index === selectedIndex ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
                onClick={() => insertMention(user)}
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-xs">{user.username[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm">@{user.username}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MentionsInput;
