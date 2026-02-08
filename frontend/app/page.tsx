import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Bienvenue sur Eventoria
          </h1>
          <p className="mt-4 text-lg text-gray-500 leading-relaxed">
            Découvrez et réservez vos événements en toute simplicité
          </p>
        </div>
      </div>
    </>
  );
}
