import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">
            Bienvenue sur Eventoria
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Découvrez et réservez vos événements en toute simplicité
          </p>
        </div>
      </div>
    </>
  );
}
