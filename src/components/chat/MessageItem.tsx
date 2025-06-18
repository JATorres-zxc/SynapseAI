// components/chat/MessageItem.tsx
import React from 'react';
import { Message } from '@/types/message';
import { FileText, Image, Download } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isCurrentUser }) => {
  const isImage = message.file?.fileType === 'image';
  const isPDF = message.file?.fileType === 'pdf';

  return (
    <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-start gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
        <Avatar className="h-8 w-8 mt-1">
          <AvatarFallback>
            {typeof message.sender === 'object' && 'username' in message.sender
              ? message.sender.username[0].toUpperCase()
              : '?'}
          </AvatarFallback>
        </Avatar>
        
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isCurrentUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          {message.content && <p className="mb-2">{message.content}</p>}
          
          {message.file && (
            <div className="mt-2">
              {isImage ? (
                <div className="flex flex-col gap-2">
                  <img 
                    src={message.file.url} 
                    alt={message.file.filename}
                    className="max-w-full h-auto rounded-md"
                  />
                  <a 
                    href={message.file.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm hover:underline"
                    download
                  >
                    <Download size={16} />
                    <span>{message.file.filename}</span>
                  </a>
                </div>
              ) : (
                <a 
                  href={message.file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:underline"
                  download
                >
                  <FileText size={20} />
                  <span>{message.file.filename}</span>
                </a>
              )}
            </div>
          )}
          
          <p className={`text-xs opacity-70 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;