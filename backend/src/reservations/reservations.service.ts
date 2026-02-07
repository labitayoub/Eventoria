import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Event, EventStatus } from '../events/entities/event.entity';
import { User, UserRole } from '../users/entities/user.entity';
import PDFDocument from 'pdfkit';

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
      where: {
        userId,
        eventId: event.id,
        status: In([ReservationStatus.PENDING, ReservationStatus.CONFIRMED]),
      },
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

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be confirmed');
    }

    const event = await this.eventRepository.findOne({
      where: { id: reservation.eventId },
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

    reservation.status = ReservationStatus.CONFIRMED;
    event.reservedSeats += 1;

    await this.eventRepository.save(event);
    return await this.reservationRepository.save(reservation);
  }

  async refuse(id: string): Promise<Reservation> {
    const reservation = await this.findOne(id);
    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException('Only pending reservations can be refused');
    }
    reservation.status = ReservationStatus.REFUSED;
    return await this.reservationRepository.save(reservation);
  }

  async cancel(id: string, userId: string, isAdmin = false): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (!isAdmin && reservation.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own reservations');
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      return reservation;
    }

    if (reservation.status === ReservationStatus.CONFIRMED) {
      const event = await this.eventRepository.findOne({
        where: { id: reservation.eventId },
      });
      if (event) {
        event.reservedSeats = Math.max(event.reservedSeats - 1, 0);
        await this.eventRepository.save(event);
      }
    }

    reservation.status = ReservationStatus.CANCELLED;
    return await this.reservationRepository.save(reservation);
  }

  async generateTicketPdf(id: string, user: User): Promise<Buffer> {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.CONFIRMED) {
      throw new BadRequestException('Ticket is only available for confirmed reservations');
    }

    const isAdmin = user.role === UserRole.ADMIN;
    if (!isAdmin && reservation.userId !== user.id) {
      throw new ForbiddenException('You can only download your own tickets');
    }

    const event = reservation.event;
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));

    doc.fontSize(22).text('Ticket de réservation', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`ID réservation: ${reservation.id}`);
    doc.text(`Participant: ${reservation.user?.firstName ?? ''} ${reservation.user?.lastName ?? ''}`.trim());
    doc.text(`Événement: ${event?.title ?? ''}`);
    if (event) {
      doc.text(`Lieu: ${event.location}`);
      doc.text(`Début: ${new Date(event.startDate).toLocaleString('fr-FR')}`);
      doc.text(`Fin: ${new Date(event.endDate).toLocaleString('fr-FR')}`);
    }

    doc.moveDown();
    doc.text('Merci pour votre réservation.', { align: 'center' });

    doc.end();

    return await new Promise<Buffer>((resolve) => {
      doc.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  async getAdminStats() {
    const now = new Date();
    const upcomingEvents = await this.eventRepository.count({
      where: { startDate: MoreThan(now) },
    });

    const events = await this.eventRepository.find();
    const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
    const totalReserved = events.reduce((sum, event) => sum + event.reservedSeats, 0);
    const fillRate = totalCapacity > 0 ? totalReserved / totalCapacity : 0;

    const reservationsByStatusRaw = await this.reservationRepository
      .createQueryBuilder('reservation')
      .select('reservation.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('reservation.status')
      .getRawMany<{ status: ReservationStatus; count: string }>();

    const reservationsByStatus = reservationsByStatusRaw.reduce(
      (acc, item) => ({
        ...acc,
        [item.status]: Number(item.count),
      }),
      {} as Record<ReservationStatus, number>,
    );

    return {
      upcomingEvents,
      fillRate,
      reservationsByStatus,
      totalReservations: reservationsByStatusRaw.reduce((sum, item) => sum + Number(item.count), 0),
    };
  }
}
