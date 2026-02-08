'use client';

import { useEffect, useState } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Reservation } from '@/types/reservation';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get<Reservation[]>('/reservations');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await api.patch(`/reservations/${id}/confirm`);
      fetchReservations();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.response?.data?.message || 'Erreur lors de la confirmation');
    }
  };

  const handleRefuse = async (id: string) => {
    try {
      await api.patch(`/reservations/${id}/refuse`);
      fetchReservations();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.response?.data?.message || 'Erreur lors du refus');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      await api.patch(`/reservations/${id}/cancel`);
      fetchReservations();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.response?.data?.message || "Erreur lors de l'annulation");
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

  return (
    <AdminRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Gestion des réservations</h1>

          {loading ? (
            <p className="text-sm text-gray-500">Chargement...</p>
          ) : reservations.length === 0 ? (
            <p className="text-sm text-gray-500">Aucune réservation.</p>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Événement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {reservation.user?.firstName} {reservation.user?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {reservation.event?.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 space-x-3 text-sm">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirm(reservation.id)}
                              className="text-green-600 hover:text-green-800 font-medium"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleRefuse(reservation.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="text-amber-600 hover:text-amber-800 font-medium"
                          >
                            Annuler
                          </button>
                        )}
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
