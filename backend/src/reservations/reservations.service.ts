import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Event, EventStatus } from '../events/entities/event.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(userId: string, createReservationDto: CreateReservationDto): Promise<Reservation> {
    const event = await this.eventRepository.findOne({
      where: { id: createReservationDto.eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not available for reservation');
    }

    const availableSeats = event.capacity - event.reservedSeats;
    if (availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }

    const existingReservation = await this.reservationRepository.findOne({
      where: { userId, eventId: event.id, status: ReservationStatus.CONFIRMED },
    });

    if (existingReservation) {
      throw new BadRequestException('You already have a reservation for this event');
    }

    const reservation = this.reservationRepository.create({
      userId,
      eventId: event.id,
      status: ReservationStatus.PENDING,
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['user', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { userId },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEvent(eventId: string): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { eventId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    return reservation;
  }

  async confirm(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status === ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Reservation already confirmed');
    }

    const event = await this.eventRepository.findOne({
      where: { id: reservation.eventId },
    });

    const availableSeats = event.capacity - event.reservedSeats;
    if (availableSeats <= 0) {
      throw new BadRequestException('No seats available');
    }

    reservation.status = ReservationStatus.CONFIRMED;
    event.reservedSeats += 1;

    await this.eventRepository.save(event);
    return await this.reservationRepository.save(reservation);
  }

  async refuse(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);
    reservation.status = ReservationStatus.REFUSED;
    return await this.reservationRepository.save(reservation);
  }

  async cancel(id: string, userId: string): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CONFIRMED) {
      const event = await this.eventRepository.findOne({
        where: { id: reservation.eventId },
      });
      event.reservedSeats -= 1;
      await this.eventRepository.save(event);
    }

    reservation.status = ReservationStatus.CANCELLED;
    return await this.reservationRepository.save(reservation);
  }
}
