import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ReserveButton from '@/components/events/ReserveButton';
import { Event } from '@/types/event';

async function getEvent(id: string): Promise<Event | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const response = await fetch(`${baseUrl}/events/published/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const event = await getEvent(params.id);

  if (!event) {
    return notFound();
  }

  const availableSeats = event.capacity - event.reservedSeats;
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center text-gray-700">
                <span className="font-semibold w-32">📍 Lieu :</span>
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <span className="font-semibold w-32">📅 Début :</span>
                <span>{startDate.toLocaleString('fr-FR')}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <span className="font-semibold w-32">🕐 Fin :</span>
                <span>{endDate.toLocaleString('fr-FR')}</span>
              </div>
              
              <div className="flex items-center text-gray-700">
                <span className="font-semibold w-32">👥 Places :</span>
                <span>{availableSeats} / {event.capacity} disponibles</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>

            <ReserveButton
              eventId={event.id}
              status={event.status}
              availableSeats={availableSeats}
            />

            {availableSeats === 0 && (
              <div className="bg-red-100 text-red-700 p-4 rounded mt-4">
                Complet - Plus de places disponibles
              </div>
            )}

            {event.status === 'cancelled' && (
              <div className="bg-orange-100 text-orange-700 p-4 rounded mt-4">
                Cet événement a été annulé
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
