import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { Event, EventStatus } from './entities/event.entity';
import { NotFoundException } from '@nestjs/common';

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
    const dto = { title: 'Test', description: 'Desc' } as Event;
    repository.create.mockReturnValue(dto);
    repository.save.mockResolvedValue(dto);

    const result = await service.create(dto as any);
    expect(result).toBe(dto);
    expect(repository.create).toHaveBeenCalledWith(dto);
    expect(repository.save).toHaveBeenCalledWith(dto);
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
    repository.save.mockResolvedValue({ ...event, status: EventStatus.PUBLISHED });

    const result = await service.publish('1');
    expect(result.status).toBe(EventStatus.PUBLISHED);
  });

  it('should cancel an event', async () => {
    const event = { id: '1', status: EventStatus.PUBLISHED } as Event;
    repository.findOne.mockResolvedValue(event);
    repository.save.mockResolvedValue({ ...event, status: EventStatus.CANCELLED });

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
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(NotFoundException);
  });
});
