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
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md transition-all duration-200">
      <h3 className="text-base font-semibold text-gray-900 mb-1.5">{event.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{event.description}</p>
      
      <div className="space-y-1.5 text-sm text-gray-600 mb-5">
        <p>📍 {event.location}</p>
        <p>📅 {startDate}</p>
        <p>👥 {availableSeats} places disponibles</p>
      </div>

      <Link
        href={`/events/${event.id}`}
        className="block w-full text-center bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Voir détails
      </Link>
    </div>
  );
}
