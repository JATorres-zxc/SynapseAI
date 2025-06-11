
import React, { useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { FileAudio, File } from 'lucide-react';
import MessageStatus from './MessageStatus';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  chatId: string;
}

const MessageList: React.FC<MessageListProps> = ({ chatId }) => {
  const { messages, typingUsers, updateMessageStatus, readReceiptsEnabled } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMessages = messages.filter(msg => msg.chatId === chatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, typingUsers]);

  // Simulate marking messages as read when they come into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.getAttribute('data-message-id');
            const message = chatMessages.find(msg => msg.id === messageId);
            
            if (message && message.senderId !== user?.id && readReceiptsEnabled && !message.status?.read) {
              setTimeout(() => {
                updateMessageStatus(messageId!, { read: true, readBy: [user?.username || 'You'] });
              }, 1000);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    const messageElements = document.querySelectorAll('[data-message-id]');
    messageElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [chatMessages, user?.id, updateMessageStatus, readReceiptsEnabled]);

  const renderMessageContent = (message: any) => {
    switch (message.type) {
      case 'voice':
        return (
          <div className="flex items-center gap-2 p-2">
            <FileAudio className="h-4 w-4" />
            <span className="text-sm">Voice message</span>
          </div>
        );
      case 'file':
        return (
          <div className="flex items-center gap-2 p-2">
            <File className="h-4 w-4" />
            <span className="text-sm">{message.content}</span>
          </div>
        );
      default:
        return message.content;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
      {chatMessages.map((message) => {
        const isOwn = message.senderId === user?.id;
        
        return (
          <div 
            key={message.id} 
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} message-animation`}
            data-message-id={message.id}
          >
            <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isOwn && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`} />
                  <AvatarFallback>{message.senderName[0]}</AvatarFallback>
                </Avatar>
              )}
              
              <div className={`space-y-1 ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                {!isOwn && (
                  <span className="text-xs text-muted-foreground px-2">{message.senderName}</span>
                )}
                <Card className={`
                  p-3 rounded-2xl max-w-xs break-words border-0
                  ${isOwn 
                    ? 'bg-slate-700 dark:bg-slate-700 text-white' 
                    : 'bg-blue-50 dark:bg-slate-800 text-foreground'
                  }
                `}>
                  {renderMessageContent(message)}
                </Card>
                <div className={`flex gap-2 items-center px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs text-muted-foreground">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <MessageStatus 
                    status={message.status} 
                    isOwn={isOwn} 
                    readReceiptsEnabled={readReceiptsEnabled}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      <TypingIndicator chatId={chatId} typingUsers={typingUsers} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
