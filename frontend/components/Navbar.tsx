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
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
              Eventoria
            </Link>
            <div className="ml-8 flex space-x-1">
              <Link href="/events" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors">
                Événements
              </Link>
              {user && (
                <Link href="/reservations" className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors">
                  Mes réservations
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500 font-medium">
                  {user.firstName} {user.lastName}
                </span>
                {user.role === 'admin' && (
                  <div className="flex gap-1 border-l border-gray-200 pl-3 ml-1">
                    <Link
                      href="/admin/events"
                      className="px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Événements
                    </Link>
                    <Link
                      href="/admin/reservations"
                      className="px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Réservations
                    </Link>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
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
