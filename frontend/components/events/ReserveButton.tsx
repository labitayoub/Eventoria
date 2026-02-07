'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { EventStatus } from '@/types/event';

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

interface ReserveButtonProps {
  eventId: string;
  status: EventStatus | string;
  availableSeats: number;
}

export default function ReserveButton({ eventId, status, availableSeats }: ReserveButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [reserving, setReserving] = useState(false);

  if (status !== EventStatus.PUBLISHED || availableSeats <= 0) {
    return null;
  }

  const handleReserve = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setReserving(true);
    try {
      await api.post('/reservations', { eventId });
      alert('Réservation créée avec succès ! En attente de confirmation.');
      router.push('/reservations');
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(apiError.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setReserving(false);
    }
  };

  return (
    <button
      onClick={handleReserve}
      disabled={reserving}
      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {reserving ? 'Réservation en cours...' : 'Réserver ma place'}
    </button>
  );
}
