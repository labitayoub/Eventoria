import { render, screen } from '@testing-library/react';
import EventCard from '@/components/events/EventCard';
import { EventStatus, type Event } from '@/types/event';

const event: Event = {
  id: '1',
  title: 'Atelier React',
  description: 'Description test',
  location: 'Paris',
  startDate: new Date('2026-02-20T10:00:00Z').toISOString(),
  endDate: new Date('2026-02-20T12:00:00Z').toISOString(),
  capacity: 50,
  reservedSeats: 10,
  status: EventStatus.PUBLISHED,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('EventCard', () => {
  it('renders event details', () => {
    render(<EventCard event={event} />);

    expect(screen.getByText('Atelier React')).toBeInTheDocument();
    expect(screen.getByText('Description test')).toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
    expect(screen.getByText(/40 places disponibles/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Voir détails/i })).toHaveAttribute('href', '/events/1');
  });
});
