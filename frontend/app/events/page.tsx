import { Event } from '@/types/event';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/events/EventCard';

async function getEvents(): Promise<Event[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/events/published`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Événements disponibles</h1>
          
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm">Aucun événement disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
