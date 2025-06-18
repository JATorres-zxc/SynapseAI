// components/chat/MessageList.tsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import MessageItem from './MessageItem'; // Import the MessageItem component

interface MessageListProps {
  userId: string;
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ userId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${userId}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setMessages(data);
        } else {
          console.error('Expected an array but got:', data);
          setMessages([]);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setMessages([]);
      }
    };
    fetchMessages();

    // Socket.IO listeners
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
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => {
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
    </div>
  );
};

export default MessageList;