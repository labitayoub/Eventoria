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
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-indigo-600">Eventoria</span>
            </Link>
            <div className="ml-10 flex items-center space-x-4">
              {user?.role !== 'admin' && (
                <>
                  <Link href="/events" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-all duration-200">
                    Événements
                  </Link>
                  {user && (
                    <Link href="/reservations" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-all duration-200">
                      Mes réservations
                    </Link>
                  )}
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <Link href="/admin" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                    Dashboard
                  </Link>
                  <Link href="/admin/events" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                    Événements
                  </Link>
                  <Link href="/admin/reservations" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                    Réservations
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-900 leading-none">
                    {user.firstName} {user.lastName}
                  </span>
                  {user.role === 'admin' && (
                    <span className="mt-0.5 text-xs text-indigo-600 font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
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
