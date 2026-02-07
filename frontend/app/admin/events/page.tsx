'use client';

import { useState, useEffect } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Event } from '@/types/event';
import Link from 'next/link';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get<Event[]>('/events');
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await api.patch(`/events/${id}/publish`);
      fetchEvents();
    } catch (error) {
      console.error('Error publishing event:', error);
      alert('Erreur lors de la publication');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/events/${id}/cancel`);
      fetchEvents();
    } catch (error) {
      console.error('Error cancelling event:', error);
      alert("Erreur lors de l'annulation");
    }
  };

  return (
    <AdminRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Gestion des événements</h1>
            <Link
              href="/admin/events/create"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Créer un événement
            </Link>
          </div>

          {loading ? (
            <p>Chargement...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-600">Aucun événement créé.</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Places</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4">{event.title}</td>
                      <td className="px-6 py-4">
                        {new Date(event.startDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          event.status === 'published' ? 'bg-green-100 text-green-800' :
                          event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {event.reservedSeats}/{event.capacity}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-blue-600 hover:underline"
                        >
                          Modifier
                        </Link>
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(event.id)}
                            className="text-green-600 hover:underline"
                          >
                            Publier
                          </button>
                        )}
                        {event.status === 'published' && (
                          <button
                            onClick={() => handleCancel(event.id)}
                            className="text-orange-600 hover:underline"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:underline"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
