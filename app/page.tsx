import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao Gerador de Cards!
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Crie cards personalizados para seus eventos de forma rápida e fácil.
        </p>
        <div className="space-y-4">
          <Link
            href="/admin"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center"
          >
            Acessar Painel Administrativo
          </Link>
          <p className="text-sm text-gray-500">
            (Para administradores: crie e gerencie seus eventos e templates)
          </p>
        </div>
      </div>
    </div>
  );
}
