'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Reservation } from '@/types/reservation';
import Link from 'next/link';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get<Reservation[]>('/reservations/my-reservations');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      await api.delete(`/reservations/${id}`);
      fetchReservations();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.response?.data?.message || "Erreur lors de l'annulation");
    }
  };

  const handleDownloadTicket = async (id: string) => {
    try {
      const response = await api.get(`/reservations/${id}/ticket`, {
        responseType: 'blob',
      });

      const blob = response.data instanceof Blob ? response.data : new Blob([response.data as BlobPart]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.response?.data?.message || 'Erreur lors du téléchargement du ticket');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-700',
      confirmed: 'bg-green-50 text-green-700',
      refused: 'bg-red-50 text-red-700',
      cancelled: 'bg-gray-100 text-gray-600',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      refused: 'Refusée',
      cancelled: 'Annulée',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">Mes réservations</h1>

          {loading ? (
             <div className="flex justify-center items-center h-48">
               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
             </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <div className="text-5xl mb-4">🎫</div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune réservation</h3>
              <p className="text-slate-500 mb-8">Vous n&apos;avez pas encore réservé d&apos;événement.</p>
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Découvrir les événements
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {reservation.event?.title}
                      </h3>
                      <div className="space-y-1.5 text-sm text-slate-600">
                        <div className="flex items-center">
                          <span className="w-5 text-indigo-500">📍</span>
                           {reservation.event?.location}
                        </div>
                        <div className="flex items-center">
                          <span className="w-5 text-indigo-500">📅</span>
                          {new Date(reservation.event?.startDate || '').toLocaleDateString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                        </div>
                        <div className="flex items-center text-slate-400 text-xs mt-2">
                          Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-0 border-slate-100">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                      
                      <div className="flex gap-2">
                        {reservation.status === 'confirmed' && (
                          <button
                            onClick={() => handleDownloadTicket(reservation.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-slate-300 shadow-sm text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
                          >
                            ⬇️ Ticket
                          </button>
                        )}
                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
