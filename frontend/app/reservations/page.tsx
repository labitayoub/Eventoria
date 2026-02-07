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

      const url = window.URL.createObjectURL(new Blob([response.data]));
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
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      refused: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800',
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Mes réservations</h1>

          {loading ? (
            <p>Chargement...</p>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">Vous n&apos;avez aucune réservation.</p>
              <Link
                href="/events"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Découvrir les événements
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2">
                        {reservation.event?.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>📍 {reservation.event?.location}</p>
                        <p>📅 {new Date(reservation.event?.startDate || '').toLocaleDateString('fr-FR')}</p>
                        <p>🕐 Réservé le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`inline-block px-3 py-1 rounded text-sm ${getStatusBadge(reservation.status)}`}>
                        {getStatusText(reservation.status)}
                      </span>
                      {reservation.status === 'confirmed' && (
                        <button
                          onClick={() => handleDownloadTicket(reservation.id)}
                          className="block w-full text-blue-600 hover:underline text-sm"
                        >
                          Télécharger le ticket PDF
                        </button>
                      )}
                      {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          className="block w-full text-red-600 hover:underline text-sm"
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
