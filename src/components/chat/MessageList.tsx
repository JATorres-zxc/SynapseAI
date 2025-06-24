// components/chat/MessageList.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Message } from '@/types/message';
import MessageItem from './MessageItem';
import { Loader2, MessageSquare } from 'lucide-react';
import { apiService } from '@/lib/api';

interface MessageListProps {
  userId: string;
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ userId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true);

  // Scroll to bottom when messages change
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Handle scroll events to disable auto-scroll when user scrolls up
  const handleScroll = () => {
    if (listContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listContainerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setIsAutoScrollEnabled(isNearBottom);
    }
  };

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive and auto-scroll is enabled
    if (isAutoScrollEnabled) {
      scrollToBottom();
    }
  }, [messages, isAutoScrollEnabled]);

  useEffect(() => {
    // Initial scroll to bottom when component mounts
    const timer = setTimeout(() => {
      scrollToBottom('auto');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.messages.getByUserId(userId);
        const data = response.data;

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Expected an array but got:', data);
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setMessages([]);
      } finally {
        setIsLoading(false);
        // Scroll to bottom after messages load
        setTimeout(() => scrollToBottom('auto'), 0);
      }
    };

    fetchMessages();

    if (socket) {
      socket.emit('joinConversation', currentUserId);

      const handleIncomingMessage = (message: Message) => {
        setMessages((prev) => [...prev, message]);
      };

      socket.on('receiveMessage', handleIncomingMessage);
      socket.on('messageSent', handleIncomingMessage);

      return () => {
        socket.off('receiveMessage', handleIncomingMessage);
        socket.off('messageSent', handleIncomingMessage);
      };
    }
  }, [currentUserId, socket, userId]);

  return (
    <div 
      ref={listContainerRef}
      className="flex-1 overflow-y-auto p-4 flex flex-col"
      onScroll={handleScroll}
    >
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No messages yet</p>
          <p className="text-sm">Send a message to start the conversation!</p>
        </div>
      )}

      {/* Messages in normal order (oldest first) */}
      {!isLoading && messages.map((msg) => {
        const isCurrentUser = 
          typeof msg.sender === 'object'
            ? msg.sender._id === currentUserId
            : msg.sender === currentUserId;

        return (
          <MessageItem 
            key={msg._id}
            message={msg}
            isCurrentUser={isCurrentUser}
          />
        );
      })}
      
      {/* This empty div will be our scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;