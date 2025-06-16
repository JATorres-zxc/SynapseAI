// types/message.ts
import { User } from './user';

export interface Message {
  _id: string;
  sender: User | string;
  recipient: User | string;
  content: string;
  read: boolean;
  createdAt: string;
}