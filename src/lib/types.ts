import type { Timestamp } from 'firebase/firestore';

export type Importance = 'urgent' | 'important' | 'low';
export type Status = 'pending' | 'in-progress' | 'solved';

export interface Ticket {
  id: string;
  location: string;
  type: string;
  description: string;
  importance: Importance;
  status: Status;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy?: string; // User ID of creator
}

export interface LocationItem {
  id: string;
  name: string;
}

export interface TypologyItem {
  id: string;
  name: string;
}

export interface Settings<T> {
  items: T[];
}
