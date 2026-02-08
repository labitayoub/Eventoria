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
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Gestion des événements</h1>
            <Link
              href="/admin/events/create"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Créer un événement
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : events.length === 0 ? (
            <p className="text-sm text-gray-500">Aucun événement créé.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Places</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(event.startDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'published' ? 'bg-green-50 text-green-700' :
                          event.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.reservedSeats}/{event.capacity}
                      </td>
                      <td className="px-6 py-4 space-x-3 text-sm">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Modifier
                        </Link>
                        {event.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(event.id)}
                            className="text-green-600 hover:text-green-800 font-medium"
                          >
                            Publier
                          </button>
                        )}
                        {event.status === 'published' && (
                          <button
                            onClick={() => handleCancel(event.id)}
                            className="text-amber-600 hover:text-amber-800 font-medium"
                          >
                            Annuler
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
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
