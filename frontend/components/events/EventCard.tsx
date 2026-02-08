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
    <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">
          {event.title}
        </h3>
        {availableSeats <= 5 && availableSeats > 0 && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            Peu de places
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-6 line-clamp-2 leading-relaxed h-10">
        {event.description}
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-gray-500">
          <span className="w-5 flex justify-center mr-2 text-indigo-500">📍</span>
          {event.location}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="w-5 flex justify-center mr-2 text-indigo-500">📅</span>
          {startDate}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="w-5 flex justify-center mr-2 text-indigo-500">👥</span>
          <span className={availableSeats === 0 ? 'text-red-500 font-medium' : ''}>
            {availableSeats === 0 ? 'Complet' : `${availableSeats} places disponibles`}
          </span>
        </div>
      </div>

      <Link
        href={`/events/${event.id}`}
        className="block w-full text-center bg-gray-50 text-indigo-600 font-semibold py-2.5 rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-200 border border-indigo-100 hover:border-transparent group-hover:shadow-md"
      >
        Voir détails
      </Link>
    </div>
  );
}
