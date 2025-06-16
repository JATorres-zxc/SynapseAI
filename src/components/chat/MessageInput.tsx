// components/chat/MessageInput.tsx
import React, { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MessageInputProps {
  chatId: string;
  currentUserId: string;
  recipientId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  chatId, 
  currentUserId, 
  recipientId 
}) => {
  const [message, setMessage] = useState('');
  const socket = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit('sendMessage', {
        sender: currentUserId,
        recipient: recipientId,
        content: message
      });
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1"
      />
      <Button type="submit">Send</Button>
    </form>
  );
};

export default MessageInput;