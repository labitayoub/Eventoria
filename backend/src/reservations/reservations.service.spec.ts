import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { Event, EventStatus } from '../events/entities/event.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { User, UserRole } from '../users/entities/user.entity';

const mockReservationRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  createQueryBuilder: jest.fn(),
});

const mockEventRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  count: jest.fn(),
});

describe('ReservationsService', () => {
  let service: ReservationsService;
  let reservationRepository: ReturnType<typeof mockReservationRepository>;
  let eventRepository: ReturnType<typeof mockEventRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(Reservation),
          useFactory: mockReservationRepository,
        },
        {
          provide: getRepositoryToken(Event),
          useFactory: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
    reservationRepository = module.get(getRepositoryToken(Reservation));
    eventRepository = module.get(getRepositoryToken(Event));
  });

  it('should prevent reservation when event not found', async () => {
    eventRepository.findOne.mockResolvedValue(null);
    await expect(service.create('user-1', { eventId: 'event-1' })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should prevent reservation for unpublished event', async () => {
    eventRepository.findOne.mockResolvedValue({ id: 'event-1', status: EventStatus.DRAFT, capacity: 10, reservedSeats: 0 });
    await expect(service.create('user-1', { eventId: 'event-1' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should prevent duplicate reservation', async () => {
    eventRepository.findOne.mockResolvedValue({ id: 'event-1', status: EventStatus.PUBLISHED, capacity: 10, reservedSeats: 0 });
    reservationRepository.findOne.mockResolvedValue({ id: 'res-1', status: ReservationStatus.PENDING });
    await expect(service.create('user-1', { eventId: 'event-1' })).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should create a pending reservation', async () => {
    eventRepository.findOne.mockResolvedValue({ id: 'event-1', status: EventStatus.PUBLISHED, capacity: 10, reservedSeats: 0 });
    reservationRepository.findOne.mockResolvedValue(null);
    reservationRepository.create.mockReturnValue({ id: 'res-1', status: ReservationStatus.PENDING });
    reservationRepository.save.mockResolvedValue({ id: 'res-1', status: ReservationStatus.PENDING });

    const result = await service.create('user-1', { eventId: 'event-1' });
    expect(result.status).toBe(ReservationStatus.PENDING);
  });

  it('should confirm a pending reservation and increment seats', async () => {
    const reservation = {
      id: 'res-1',
      status: ReservationStatus.PENDING,
      eventId: 'event-1',
      userId: 'user-1',
      user: { id: 'user-1', role: UserRole.PARTICIPANT } as User,
      event: { id: 'event-1', status: EventStatus.PUBLISHED } as Event,
    } as Reservation;

    reservationRepository.findOne.mockResolvedValue(reservation);
    eventRepository.findOne.mockResolvedValue({ id: 'event-1', status: EventStatus.PUBLISHED, capacity: 10, reservedSeats: 0 });
    reservationRepository.save.mockResolvedValue({ ...reservation, status: ReservationStatus.CONFIRMED });

    const result = await service.confirm('res-1');
    expect(result.status).toBe(ReservationStatus.CONFIRMED);
    expect(eventRepository.save).toHaveBeenCalled();
  });

  it('should not confirm non-pending reservation', async () => {
    reservationRepository.findOne.mockResolvedValue({
      id: 'res-1',
      status: ReservationStatus.REFUSED,
      eventId: 'event-1',
      userId: 'user-1',
      user: { id: 'user-1', role: UserRole.PARTICIPANT } as User,
      event: { id: 'event-1', status: EventStatus.PUBLISHED } as Event,
    });

    await expect(service.confirm('res-1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should allow owner to cancel confirmed reservation', async () => {
    const reservation = {
      id: 'res-1',
      status: ReservationStatus.CONFIRMED,
      eventId: 'event-1',
      userId: 'user-1',
      user: { id: 'user-1', role: UserRole.PARTICIPANT } as User,
      event: { id: 'event-1', status: EventStatus.PUBLISHED } as Event,
    } as Reservation;

    reservationRepository.findOne.mockResolvedValue(reservation);
    eventRepository.findOne.mockResolvedValue({ id: 'event-1', reservedSeats: 1 });
    reservationRepository.save.mockResolvedValue({ ...reservation, status: ReservationStatus.CANCELLED });

    const result = await service.cancel('res-1', 'user-1');
    expect(result.status).toBe(ReservationStatus.CANCELLED);
    expect(eventRepository.save).toHaveBeenCalled();
  });

  it('should block cancel by other user', async () => {
    reservationRepository.findOne.mockResolvedValue({
      id: 'res-1',
      status: ReservationStatus.PENDING,
      eventId: 'event-1',
      userId: 'user-1',
      user: { id: 'user-1', role: UserRole.PARTICIPANT } as User,
      event: { id: 'event-1', status: EventStatus.PUBLISHED } as Event,
    });

    await expect(service.cancel('res-1', 'user-2')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('should generate a ticket for confirmed reservation', async () => {
    const reservation = {
      id: 'res-1',
      status: ReservationStatus.CONFIRMED,
      eventId: 'event-1',
      userId: 'user-1',
      user: { id: 'user-1', role: UserRole.PARTICIPANT, firstName: 'John', lastName: 'Doe' } as User,
      event: { id: 'event-1', title: 'Event', location: 'Paris', startDate: new Date(), endDate: new Date() } as Event,
    } as Reservation;

    reservationRepository.findOne.mockResolvedValue(reservation);

    const buffer = await service.generateTicketPdf('res-1', { id: 'user-1', role: UserRole.PARTICIPANT } as User);
    expect(buffer).toBeInstanceOf(Buffer);
  });
});
