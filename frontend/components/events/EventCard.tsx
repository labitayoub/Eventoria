import Link from 'next/link';
import { Event } from '@/types/event';

export default function EventCard({ event }: { event: Event }) {
  const availableSeats = event.capacity - event.reservedSeats;
  const startDate = new Date(event.startDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
      
      <div className="space-y-2 text-sm text-gray-700 mb-4">
        <p>📍 {event.location}</p>
        <p>📅 {startDate}</p>
        <p>👥 {availableSeats} places disponibles</p>
      </div>

      <Link
        href={`/events/${event.id}`}
        className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Voir détails
      </Link>
    </div>
  );
}
