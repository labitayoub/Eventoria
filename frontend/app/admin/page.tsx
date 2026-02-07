'use client';

import AdminRoute from '@/components/AdminRoute';
import Navbar from '@/components/Navbar';

export default function AdminPage() {
  return (
    <AdminRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">
              Bienvenue dans l&apos;espace administrateur
            </p>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
