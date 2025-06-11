
import React from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Pin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PinnedMessagesProps {
  chatId: string;
}

const PinnedMessages: React.FC<PinnedMessagesProps> = ({ chatId }) => {
  const { getPinnedMessages, unpinMessage } = useSocket();
  const { user } = useAuth();
  const pinnedMessages = getPinnedMessages(chatId);

  if (pinnedMessages.length === 0) return null;

  return (
    <div className="bg-muted/30 border-b border-border p-2 space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Pin className="h-4 w-4" />
        <span>Pinned Messages ({pinnedMessages.length})</span>
      </div>
      {pinnedMessages.map((message) => (
        <Card key={message.id} className="p-2 bg-background/50">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-foreground">
                  {message.senderName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(message.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
              <p className="text-sm text-foreground truncate">
                {message.content}
              </p>
            </div>
            {(message.senderId === user?.id || user?.id === 'user1') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => unpinMessage(message.id)}
                className="h-6 w-6 p-0 hover:bg-destructive/10"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PinnedMessages;
