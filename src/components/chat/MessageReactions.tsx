
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import EmojiPicker from './EmojiPicker';
import { Plus } from 'lucide-react';

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface MessageReactionsProps {
  messageId: string;
  reactions?: Reaction[];
}

const MessageReactions: React.FC<MessageReactionsProps> = ({ messageId, reactions = [] }) => {
  const { user } = useAuth();
  const { addReaction, removeReaction } = useSocket();

  const handleReactionClick = (emoji: string) => {
    const reaction = reactions.find(r => r.emoji === emoji);
    const userHasReacted = reaction?.users.includes(user?.username || '');
    
    if (userHasReacted) {
      removeReaction(messageId, emoji);
    } else {
      addReaction(messageId, emoji);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    addReaction(messageId, emoji);
  };

  if (reactions.length === 0) {
    return (
      <div className="flex items-center gap-1 mt-1">
        <EmojiPicker onEmojiSelect={handleEmojiSelect}>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Plus className="h-3 w-3" />
          </Button>
        </EmojiPicker>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-1 flex-wrap">
      {reactions.map((reaction) => {
        const userHasReacted = reaction.users.includes(user?.username || '');
        return (
          <Badge
            key={reaction.emoji}
            variant={userHasReacted ? "default" : "secondary"}
            className={`text-xs cursor-pointer hover:bg-accent transition-colors ${
              userHasReacted ? 'bg-primary/20 text-primary border-primary/30' : ''
            }`}
            onClick={() => handleReactionClick(reaction.emoji)}
          >
            <span className="mr-1">{reaction.emoji}</span>
            <span>{reaction.count}</span>
          </Badge>
        );
      })}
      <EmojiPicker onEmojiSelect={handleEmojiSelect}>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Plus className="h-3 w-3" />
        </Button>
      </EmojiPicker>
    </div>
  );
};

export default MessageReactions;
