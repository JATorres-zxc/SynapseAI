import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Mic, File, Settings } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface MessageInputProps {
  chatId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const { sendMessage, setTyping, readReceiptsEnabled, setReadReceiptsEnabled } = useSocket();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Clear typing indicator
    setTyping(chatId, false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendMessage({
      senderId: user?.id || '',
      senderName: user?.username || '',
      content: message,
      type: 'text',
      chatId
    });

    setMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Handle typing indicator
    if (value.trim()) {
      setTyping(chatId, true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(chatId, false);
      }, 2000);
    } else {
      setTyping(chatId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup typing indicator on unmount
      setTyping(chatId, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [chatId, setTyping]);

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
            onChange={handleInputChange}
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

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Message Settings</h4>
                <p className="text-sm text-muted-foreground">
                  Configure your messaging preferences
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="read-receipts" className="text-sm font-normal">
                  Read receipts
                </Label>
                <Switch
                  id="read-receipts"
                  checked={readReceiptsEnabled}
                  onCheckedChange={setReadReceiptsEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                When enabled, others can see when you've read their messages, and you can see when they've read yours.
              </p>
            </div>
          </PopoverContent>
        </Popover>

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
