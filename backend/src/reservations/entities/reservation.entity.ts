import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Event } from '../../events/entities/event.entity';

export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  REFUSED = 'refused',
  CANCELED = 'canceled'
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column() eventId: string;
  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDING }) status: ReservationStatus;
  @ManyToOne(() => User) user: User;
  @ManyToOne(() => Event) event: Event;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
