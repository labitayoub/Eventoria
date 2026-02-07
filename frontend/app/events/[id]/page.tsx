'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Event } from '@/types/event';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${params.id}`);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setReserving(true);
    try {
      await api.post('/reservations', { eventId: params.id });
      alert('Réservation créée avec succès ! En attente de confirmation.');
      router.push('/reservations');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setReserving(false);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (!event) return <div>Événement non trouvé</div>;

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

            {event.status === 'published' && availableSeats > 0 && (
              <button
                onClick={handleReserve}
                disabled={reserving}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {reserving ? 'Réservation en cours...' : 'Réserver ma place'}
              </button>
            )}

            {availableSeats === 0 && (
              <div className="bg-red-100 text-red-700 p-4 rounded">
                Complet - Plus de places disponibles
              </div>
            )}

            {event.status === 'cancelled' && (
              <div className="bg-orange-100 text-orange-700 p-4 rounded">
                Cet événement a été annulé
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
