'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Eventoria
            </Link>
            <div className="ml-10 flex space-x-4">
              <Link href="/events" className="text-gray-700 hover:text-blue-600">
                Événements
              </Link>
              {user && (
                <Link href="/reservations" className="text-gray-700 hover:text-blue-600">
                  Mes réservations
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                {user.role === 'admin' && (
                  <div className="flex gap-2">
                    <Link
                      href="/admin/events"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Événements
                    </Link>
                    <Link
                      href="/admin/reservations"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Réservations
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-blue-600 hover:underline"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
