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
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Mes réservations</h1>

          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <p className="text-gray-500 mb-5">Vous n&apos;avez aucune réservation.</p>
              <Link
                href="/events"
                className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Découvrir les événements
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                        {reservation.event?.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p>📍 {reservation.event?.location}</p>
                        <p>📅 {new Date(reservation.event?.startDate || '').toLocaleDateString('fr-FR')}</p>
                        <p>🕐 Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleDownloadTicket(reservation.id)}
                          className="block w-full text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Télécharger le ticket PDF
                        </button>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className="block w-full text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Annuler
                        </button>
                      )}
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
