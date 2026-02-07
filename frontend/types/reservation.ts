import { Event } from './event';
import { User } from './user';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REFUSED = 'refused',
  CANCELLED = 'cancelled',
}

export interface Reservation {
  id: string;
  userId: string;
  eventId: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  user?: User;
  event?: Event;
}
