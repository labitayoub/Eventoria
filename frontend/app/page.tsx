import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="relative overflow-hidden bg-white">
          <div className="absolute inset-y-0 right-0 w-1/2 bg-indigo-50/50 blur-3xl opacity-50 transform translate-x-1/2"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center md:text-left md:max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Découvrez et réservez des <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">événements inoubliables</span>
              </h1>
              <p className="mt-4 text-xl text-slate-600 leading-relaxed mb-8">
                Eventoria est la plateforme de référence pour trouver les meilleures conférences, ateliers et événements sociaux près de chez vous.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link 
                  href="/events" 
                  className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Explorer les événements
                </Link>
                <Link 
                  href="/register" 
                  className="inline-flex justify-center items-center px-8 py-3.5 border border-indigo-200 text-base font-semibold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 md:text-lg hover:shadow-md transition-all duration-200"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-2xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Recherche Facile</h3>
              <p className="text-slate-600">Trouvez rapidement les événements qui vous correspondent grâce à nos filtres avancés.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mb-6">🎟️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Réservation Instantanée</h3>
              <p className="text-slate-600">Réservez votre place en quelques clics et recevez instantanément votre confirmation.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-2xl mb-6">🤝</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Communauté Active</h3>
              <p className="text-slate-600">Rejoignez des milliers de passionnés et partagez des moments uniques.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
