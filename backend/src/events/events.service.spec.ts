import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event, EventStatus } from './entities/event.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

const mockEventRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

describe('EventsService', () => {
  let service: EventsService;
  let repository: ReturnType<typeof mockEventRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useFactory: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get(getRepositoryToken(Event));
  });

  it('should create an event', async () => {
    const dto: CreateEventDto = {
      title: 'Test',
      description: 'Desc',
      location: 'Paris',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      capacity: 10,
      status: EventStatus.DRAFT,
    };
    const savedEvent: Event = {
      id: '1',
      title: dto.title,
      description: dto.description,
      location: dto.location,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      capacity: dto.capacity,
      reservedSeats: 0,
      status: dto.status ?? EventStatus.DRAFT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repository.create.mockReturnValue(savedEvent);
    repository.save.mockResolvedValue(savedEvent);

    const result = await service.create(dto);
    expect(result).toBe(savedEvent);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(savedEvent);
  });

  it('should return published events', async () => {
    repository.find.mockResolvedValue([]);
    await service.findPublished();
    expect(repository.find).toHaveBeenCalledWith({
      where: { status: EventStatus.PUBLISHED },
      order: { startDate: 'ASC' },
    });
  });

  it('should publish an event', async () => {
    const event = { id: '1', status: EventStatus.DRAFT } as Event;
    repository.findOne.mockResolvedValue(event);
    repository.save.mockResolvedValue({
      ...event,
      status: EventStatus.PUBLISHED,
    });

    const result = await service.publish('1');
    expect(result.status).toBe(EventStatus.PUBLISHED);
  });

  it('should cancel an event', async () => {
    const event = { id: '1', status: EventStatus.PUBLISHED } as Event;
    repository.findOne.mockResolvedValue(event);
    repository.save.mockResolvedValue({
      ...event,
      status: EventStatus.CANCELLED,
    });

    const result = await service.cancel('1');
    expect(result.status).toBe(EventStatus.CANCELLED);
  });

  it('should compute available seats', async () => {
    const event = { id: '1', capacity: 10, reservedSeats: 3 } as Event;
    repository.findOne.mockResolvedValue(event);

    const result = await service.getAvailableSeats('1');
    expect(result).toBe(7);
  });

  it('should throw if event not found', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
