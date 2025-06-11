
import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { FileAudio, File, Pin, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MessageStatus from './MessageStatus';
import TypingIndicator from './TypingIndicator';
import PinnedMessages from './PinnedMessages';
import ForwardMessageModal from './ForwardMessageModal';
import MessageActions from './MessageActions';
import ReplyInput from './ReplyInput';

interface MessageListProps {
  chatId: string;
}

const MessageList: React.FC<MessageListProps> = ({ chatId }) => {
  const { 
    messages, 
    typingUsers, 
    updateMessageStatus, 
    readReceiptsEnabled,
    pinMessage,
    unpinMessage,
    editMessage,
    deleteMessage,
    replyToMessage,
    getMessageById
  } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [forwardModalOpen, setForwardModalOpen] = useState(false);
  const [messageToForward, setMessageToForward] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    messageId: string;
    content: string;
    senderName: string;
  } | null>(null);

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

  const handlePinMessage = (messageId: string, isPinned: boolean) => {
    if (isPinned) {
      unpinMessage(messageId);
    } else {
      pinMessage(messageId);
    }
  };

  const handleForwardMessage = (messageId: string) => {
    setMessageToForward(messageId);
    setForwardModalOpen(true);
  };

  const handleEditMessage = (messageId: string, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditContent(currentContent);
  };

  const handleReplyToMessage = (messageId: string) => {
    const message = getMessageById(messageId);
    if (message) {
      setReplyingTo({
        messageId: message.id,
        content: message.content,
        senderName: message.senderName
      });
    }
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleSaveEdit = (messageId: string) => {
    if (editContent.trim()) {
      editMessage(messageId, editContent.trim());
    }
    setEditingMessageId(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const renderReplyContext = (replyTo: any) => {
    return (
      <div className="mb-2 p-2 bg-muted/20 rounded border-l-2 border-primary">
        <div className="flex items-center gap-2 mb-1">
          <Reply className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-primary">
            {replyTo.senderName}
          </span>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {replyTo.content}
        </p>
      </div>
    );
  };

  const renderMessageContent = (message: any) => {
    if (message.isDeleted) {
      return (
        <span className="italic text-muted-foreground">
          {message.content}
        </span>
      );
    }

    if (editingMessageId === message.id) {
      return (
        <div className="space-y-2">
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit(message.id);
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleSaveEdit(message.id)}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

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
        return (
          <div>
            {message.replyTo && renderReplyContext(message.replyTo)}
            {message.forwardedFrom && (
              <div className="text-xs text-muted-foreground mb-1 p-2 bg-muted/20 rounded border-l-2 border-primary">
                Forwarded from {message.forwardedFrom.originalSender} • {' '}
                {new Date(message.forwardedFrom.originalTimestamp).toLocaleString()}
              </div>
            )}
            {message.content}
          </div>
        );
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      <PinnedMessages chatId={chatId} />
      <div className="p-4 space-y-4">
        {chatMessages.map((message) => {
          const isOwn = message.senderId === user?.id;
          
          return (
            <div 
              key={message.id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'} message-animation group`}
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
                  <div className="relative">
                    <Card className={`
                      p-3 rounded-2xl max-w-xs break-words border-0 relative
                      ${isOwn 
                        ? `bg-slate-700 dark:bg-slate-700 text-white ${message.isDeleted ? 'opacity-60' : ''}` 
                        : `bg-blue-50 dark:bg-slate-800 text-foreground ${message.isDeleted ? 'opacity-60' : ''}`
                      }
                    `}>
                      {message.isPinned && (
                        <Pin className="absolute -top-1 -right-1 h-3 w-3 text-primary" />
                      )}
                      {renderMessageContent(message)}
                    </Card>
                    <div className={`absolute top-2 ${isOwn ? '-left-10' : '-right-10'}`}>
                      <MessageActions
                        messageId={message.id}
                        isPinned={message.isPinned || false}
                        isOwn={isOwn}
                        isDeleted={message.isDeleted || false}
                        onReply={() => handleReplyToMessage(message.id)}
                        onPin={() => handlePinMessage(message.id, message.isPinned || false)}
                        onEdit={() => handleEditMessage(message.id, message.content)}
                        onDelete={() => deleteMessage(message.id)}
                        onForward={() => handleForwardMessage(message.id)}
                      />
                    </div>
                  </div>
                  <div className={`flex gap-2 items-center px-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.isEdited && <span className="ml-1">(edited)</span>}
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

      <ReplyInput
        replyingTo={replyingTo}
        onCancelReply={handleCancelReply}
      />

      <ForwardMessageModal
        isOpen={forwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
        messageId={messageToForward}
      />
    </div>
  );
};

export default MessageList;
