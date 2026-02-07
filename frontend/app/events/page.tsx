import { Event } from '@/types/event';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/events/EventCard';

async function getPublishedEvents(): Promise<Event[]> {
  const { data } = await api.get('/events/published');
  return data;
}

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">Événements disponibles</h1>
          
          {events.length === 0 ? (
            <p className="text-gray-600">Aucun événement disponible pour le moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
