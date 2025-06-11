
import React from 'react';
import { Check, CheckCheck, Eye } from 'lucide-react';

interface MessageStatusProps {
  status?: {
    sent: boolean;
    delivered: boolean;
    read: boolean;
    readBy?: string[];
  };
  isOwn: boolean;
  readReceiptsEnabled: boolean;
}

const MessageStatus: React.FC<MessageStatusProps> = ({ status, isOwn, readReceiptsEnabled }) => {
  if (!status || !isOwn) return null;

  const getStatusIcon = () => {
    if (readReceiptsEnabled && status.read) {
      return <Eye className="h-3 w-3 text-blue-500" />;
    }
    
    if (status.delivered) {
      return <CheckCheck className="h-3 w-3 text-gray-500" />;
    }
    
    if (status.sent) {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
    
    return null;
  };

  const getStatusText = () => {
    if (readReceiptsEnabled && status.read && status.readBy && status.readBy.length > 0) {
      return status.readBy.length === 1 
        ? `Read by ${status.readBy[0]}`
        : `Read by ${status.readBy.length} people`;
    }
    
    if (status.delivered) return 'Delivered';
    if (status.sent) return 'Sent';
    
    return '';
  };

  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground">
      {getStatusIcon()}
      <span>{getStatusText()}</span>
    </div>
  );
};

export default MessageStatus;
