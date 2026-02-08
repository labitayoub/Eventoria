'use client';

import { Event } from '@/types/event';
import Navbar from '@/components/Navbar';
import EventCard from '@/components/events/EventCard';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get<Event[]>('/events/published');
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Événements disponibles</h1>
          
          {loading ? (
            <p className="text-gray-500 text-sm">Chargement...</p>
          ) : events.length === 0 ? (
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
