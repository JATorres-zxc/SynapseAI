
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Reply } from 'lucide-react';

interface ReplyInputProps {
  replyingTo: {
    messageId: string;
    content: string;
    senderName: string;
  } | null;
  onCancelReply: () => void;
}

const ReplyInput: React.FC<ReplyInputProps> = ({ replyingTo, onCancelReply }) => {
  if (!replyingTo) return null;

  return (
    <Card className="p-3 mx-4 mb-2 bg-muted/30 border-l-4 border-primary">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <Reply className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-primary mb-1">
              Replying to {replyingTo.senderName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {replyingTo.content}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelReply}
          className="h-6 w-6 p-0 shrink-0"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </Card>
  );
};

export default ReplyInput;
