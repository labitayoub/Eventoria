'use client';

import { useEffect, useState } from 'react';
import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { Reservation } from '@/types/reservation';

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
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la confirmation');
    }
  };

  const handleRefuse = async (id: string) => {
    try {
      await api.patch(`/reservations/${id}/refuse`);
      fetchReservations();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors du refus');
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      await api.patch(`/reservations/${id}/cancel`);
      fetchReservations();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de l\'annulation');
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

  return (
    <AdminRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Gestion des réservations</h1>

          {loading ? (
            <p>Chargement...</p>
          ) : reservations.length === 0 ? (
            <p className="text-gray-600">Aucune réservation.</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Événement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4">
                        {reservation.user?.firstName} {reservation.user?.lastName}
                      </td>
                      <td className="px-6 py-4">
                        {reservation.event?.title}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        {reservation.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirm(reservation.id)}
                              className="text-green-600 hover:underline"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleRefuse(reservation.id)}
                              className="text-red-600 hover:underline"
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="text-orange-600 hover:underline"
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
