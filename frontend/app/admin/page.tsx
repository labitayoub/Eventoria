'use client';

import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import { useEffect, useState } from 'react';

interface AdminStats {
  upcomingEvents: number;
  fillRate: number;
  reservationsByStatus: Record<string, number>;
  totalReservations: number;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get<AdminStats>('/reservations/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const fillRatePercent = stats ? Math.round(stats.fillRate * 100) : 0;

  return (
    <AdminRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
          {loading ? (
            <p>Chargement...</p>
          ) : !stats ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-600">Impossible de charger les statistiques.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Événements à venir</p>
                <p className="text-2xl font-bold mt-2">{stats.upcomingEvents}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Taux de remplissage</p>
                <p className="text-2xl font-bold mt-2">{fillRatePercent}%</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Réservations totales</p>
                <p className="text-2xl font-bold mt-2">{stats.totalReservations}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-sm text-gray-500">Répartition par statut</p>
                <div className="mt-2 space-y-1 text-sm text-gray-700">
                  <div>En attente: {stats.reservationsByStatus?.pending || 0}</div>
                  <div>Confirmées: {stats.reservationsByStatus?.confirmed || 0}</div>
                  <div>Refusées: {stats.reservationsByStatus?.refused || 0}</div>
                  <div>Annulées: {stats.reservationsByStatus?.cancelled || 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
