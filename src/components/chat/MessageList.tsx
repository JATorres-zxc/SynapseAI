// components/chat/MessageList.tsx
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Message } from '@/types/message';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
  }, [currentUserId, socket]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg) => {
        const isSender =
          typeof msg.sender === 'object'
            ? msg.sender._id === currentUserId
            : msg.sender === currentUserId;

        return (
          <div
            key={msg._id}
            className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                isSender
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-foreground'
              }`}
            >
              <div className={`flex items-center gap-2 mb-1 ${isSender ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-6 w-6">
                  <AvatarFallback>
                    {typeof msg.sender === 'object' && 'username' in msg.sender && msg.sender.username
                      ? msg.sender.username[0]
                      : '?'}
                  </AvatarFallback>
                </Avatar>
                <p>{msg.content}</p>
              </div>
              <p className="text-xs opacity-70">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;