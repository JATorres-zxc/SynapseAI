// components/chat/MessageInput.tsx
import React, { useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus2, X } from 'lucide-react';
import axios from 'axios';
import { FileAttachment } from '@/types/message';
import { setupTour } from '@/lib/tour';
interface MessageInputProps {
  chatId: string;
  currentUserId: string;
  recipientId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  chatId, 
  currentUserId, 
  recipientId 
}) => {
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<FileAttachment | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socket = useSocket();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await axios.post('/api/messages/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setFile(response.data);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!message.trim() && !file) || !socket) return;

    const messageData = {
      sender: currentUserId,
      recipient: recipientId,
      content: message,
      file: file || undefined
    };

    socket.emit('sendMessage', messageData);
    setMessage('');
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border flex flex-col gap-2" id="message-input">
      {file && (
        <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{file.filename}</span>
            <span className="text-xs text-gray-500">
              ({Math.round(file.size / 1024)} KB)
            </span>
          </div>
          <button 
            type="button" 
            onClick={removeFile}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove attached file"
            title="Remove attached file"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      
      <div className="flex gap-2">
        <label htmlFor="message-input" className="sr-only">
          Type your message
        </label>
        <Input
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          aria-label="Message input"
        />
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg,.pdf"
          className="hidden"
          disabled={isUploading}
          id="file-upload"
          aria-label="Upload file"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="Attach file"
          title="Attach file"
        >
          <FilePlus2 size={18} aria-hidden="true" />
          <span className="sr-only">Attach file</span>
        </Button>
        
        <Button 
          type="submit" 
          disabled={isUploading}
          aria-label="Send message"
          title="Send message"
        >
          {isUploading ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;