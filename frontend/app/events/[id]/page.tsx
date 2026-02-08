'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ReserveButton from '@/components/events/ReserveButton';
import { Event } from '@/types/event';
import api from '@/lib/api';

export default function EventDetailPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get<Event>(`/events/published/${params.id}`);
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <p className="text-gray-500">Chargement...</p>
        </div>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          <p className="text-gray-500">Événement non trouvé</p>
        </div>
      </>
    );
  }

  const availableSeats = event.capacity - event.reservedSeats;
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-6">{event.title}</h1>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium text-gray-900 w-28">📍 Lieu</span>
                <span>{event.location}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium text-gray-900 w-28">📅 Début</span>
                <span>{startDate.toLocaleString('fr-FR')}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium text-gray-900 w-28">🕐 Fin</span>
                <span>{endDate.toLocaleString('fr-FR')}</span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium text-gray-900 w-28">👥 Places</span>
                <span>{availableSeats} / {event.capacity} disponibles</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{event.description}</p>
            </div>

            <ReserveButton
              eventId={event.id}
              status={event.status}
              availableSeats={availableSeats}
            />

            {availableSeats === 0 && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mt-4">
                Complet — Plus de places disponibles
              </div>
            )}

            {event.status === 'cancelled' && (
              <div className="bg-amber-50 text-amber-700 p-4 rounded-lg text-sm mt-4">
                Cet événement a été annulé
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
