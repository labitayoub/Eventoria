import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published', 
  CANCELED = 'canceled'
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() title: string;
  @Column('text') description: string;
  @Column() dateTime: Date;
  @Column() location: string;
  @Column() maxCapacity: number;
  @Column({ default: 0 }) currentReservations: number;
  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.DRAFT }) status: EventStatus;
  @Column() createdBy: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
