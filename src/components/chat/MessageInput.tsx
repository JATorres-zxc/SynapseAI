
import React, { useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Mic, File } from 'lucide-react';

interface MessageInputProps {
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage } = useSocket();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    sendMessage({
      senderId: user?.id || '',
      senderName: user?.username || '',
      content: message,
      type: 'text',
      chatId
    });

    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Tap the mic again to stop recording.",
      });
      
      // Simulate recording
      setTimeout(() => {
        setIsRecording(false);
        sendMessage({
          senderId: user?.id || '',
          senderName: user?.username || '',
          content: 'Voice message',
          type: 'voice',
          chatId
        });
        toast({
          title: "Voice message sent",
        });
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendMessage({
        senderId: user?.id || '',
        senderName: user?.username || '',
        content: file.name,
        type: 'file',
        chatId
      });
      
      toast({
        title: "File sent",
        description: file.name,
      });
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="flex items-end gap-2">
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileSelect}
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl"
        >
          <File className="h-4 w-4" />
        </Button>

        <div className="flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="chat-input resize-none rounded-xl border-border focus:ring-primary"
            rows={1}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleVoiceRecord}
          className={`rounded-xl ${isRecording ? 'bg-red-500 text-white animate-pulse' : ''}`}
        >
          <Mic className="h-4 w-4" />
        </Button>

        <Button
          onClick={handleSendMessage}
          disabled={!message.trim()}
          className="rounded-xl"
          size="icon"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
