// types/message.ts
import { User } from './user';

export interface FileAttachment {
  url: string;
  filename: string;
  fileType: 'image' | 'pdf';
  size: number;
}

export interface Message {
  _id: string;
  sender: User | string;
  recipient: User | string;
  content: string;
  file?: FileAttachment;
  read: boolean;
  createdAt: string;
}