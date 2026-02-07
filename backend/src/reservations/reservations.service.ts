import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, MoreThan } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Event, EventStatus } from '../events/entities/event.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
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
      throw new BadRequestException(
        'You already have a reservation for this event',
      );
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
      throw new BadRequestException(
        'Only pending reservations can be confirmed',
      );
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

  async cancel(
    id: string,
    userId: string,
    isAdmin = false,
  ): Promise<Reservation> {
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
      throw new BadRequestException(
        'Ticket is only available for confirmed reservations',
      );
    }

    const isAdmin = user.role === UserRole.ADMIN;
    if (!isAdmin && reservation.userId !== user.id) {
      throw new ForbiddenException('You can only download your own tickets');
    }

    const event = reservation.event;
    const lines = [
      'Ticket de réservation',
      `ID réservation: ${reservation.id}`,
      `Participant: ${reservation.user?.firstName ?? ''} ${reservation.user?.lastName ?? ''}`.trim(),
      `Événement: ${event?.title ?? ''}`,
    ];

    if (event) {
      lines.push(`Lieu: ${event.location}`);
      lines.push(`Début: ${new Date(event.startDate).toLocaleString('fr-FR')}`);
      lines.push(`Fin: ${new Date(event.endDate).toLocaleString('fr-FR')}`);
    }

    lines.push('Merci pour votre réservation.');

    return this.buildPdf(lines);
  }

  private buildPdf(lines: string[]): Buffer {
    const escapePdfText = (text: string) =>
      text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

    const contentLines = lines
      .map((line) => `(${escapePdfText(line)}) Tj\nT*`)
      .join('\n');
    const content = `BT\n/F1 12 Tf\n50 750 Td\n12 TL\n${contentLines}\nET`;

    const objects = [
      '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj',
      '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj',
      '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj',
      `4 0 obj\n<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream\nendobj`,
      '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj',
    ];

    let pdf = '%PDF-1.4\n';
    const offsets: number[] = [0];

    objects.forEach((obj) => {
      offsets.push(Buffer.byteLength(pdf));
      pdf += `${obj}\n`;
    });

    const xrefStart = Buffer.byteLength(pdf);
    let xref = 'xref\n0 6\n';
    xref += '0000000000 65535 f \n';

    for (let i = 1; i < offsets.length; i += 1) {
      const offset = offsets[i].toString().padStart(10, '0');
      xref += `${offset} 00000 n \n`;
    }

    const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
    pdf += xref + trailer;

    return Buffer.from(pdf);
  }

  async getAdminStats() {
    const now = new Date();
    const upcomingEvents = await this.eventRepository.count({
      where: { startDate: MoreThan(now) },
    });

    const events = await this.eventRepository.find();
    const totalCapacity = events.reduce(
      (sum, event) => sum + event.capacity,
      0,
    );
    const totalReserved = events.reduce(
      (sum, event) => sum + event.reservedSeats,
      0,
    );
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
      totalReservations: reservationsByStatusRaw.reduce(
        (sum, item) => sum + Number(item.count),
        0,
      ),
    };
  }
}
