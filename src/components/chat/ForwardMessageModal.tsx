
import React, { useState } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface ForwardMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string | null;
}

const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({
  isOpen,
  onClose,
  messageId
}) => {
  const { forwardMessage } = useSocket();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Mock chat list - in real app this would come from your chat context
  const availableChats = [
    { id: 'chat2', name: 'Alice Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=150&h=150&fit=crop&crop=face' },
    { id: 'chat3', name: 'Bob Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { id: 'chat4', name: 'Team Discussion', avatar: null },
  ];

  const handleForward = () => {
    if (messageId && selectedChat) {
      forwardMessage(messageId, selectedChat);
      onClose();
      setSelectedChat(null);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedChat(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select a chat to forward this message to:
          </p>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {availableChats.map((chat) => (
              <Card
                key={chat.id}
                className={`p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedChat === chat.id ? 'bg-primary/10 border-primary' : ''
                }`}
                onClick={() => setSelectedChat(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={chat.avatar || undefined} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{chat.name}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleForward} 
              disabled={!selectedChat}
            >
              Forward
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForwardMessageModal;
