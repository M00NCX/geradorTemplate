'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Participacao {
  id: number;
  nome: string;
  empresa: string;
  campo_extra_valor: string | null;
  foto_url: string;
  card_url: string;
  created_at: string;
}

interface Evento {
  id: number;
  nome_evento: string;
  slug: string;
  template_url: string;
  campo_extra_label: string | null;
  foto_x: number;
  foto_y: number;
  foto_width: number;
  foto_height: number;
  foto_shape: string;
  nome_x: number;
  nome_y: number;
  nome_font_size: number;
  nome_font_family: string;
  created_at: string;
  participacoes: Participacao[];
  _count: {
    participacoes: number;
  };
}

export default function EventoMonitorPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchEvento();
    }
  }, [slug]);

  const fetchEvento = async () => {
    try {
      const response = await fetch(`/api/admin/evento/${slug}`);
      const data = await response.json();

      if (response.ok) {
        setEvento(data.evento);
      } else {
        console.error('Evento não encontrado');
      }
    } catch (error) {
      console.error('Erro ao carregar evento:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    window.open(`/api/admin/evento/${slug}/export`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Evento não encontrado
          </h1>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            ← Voltar ao painel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Voltar ao painel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {evento.nome_evento}
          </h1>
          <p className="mt-2 text-gray-600">
            Monitoramento e estatísticas do evento
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👥</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total de Participações
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {evento._count.participacoes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📅</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Data de Criação
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(evento.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🎨</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Fonte do Nome
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {evento.nome_font_family} {evento.nome_font_size}px
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📸</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Formato da Foto
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {evento.foto_shape === 'circle' ? 'Circular' : 'Quadrada'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Configurações do Template */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Configurações do Template
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Configurações da Foto
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posição X:</span>
                  <span className="font-medium">{evento.foto_x}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posição Y:</span>
                  <span className="font-medium">{evento.foto_y}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Largura:</span>
                  <span className="font-medium">{evento.foto_width}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Altura:</span>
                  <span className="font-medium">{evento.foto_height}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Formato:</span>
                  <span className="font-medium">
                    {evento.foto_shape === 'circle' ? 'Circular' : 'Quadrada'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3">
                Configurações do Nome
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Posição X:</span>
                  <span className="font-medium">{evento.nome_x}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Posição Y:</span>
                  <span className="font-medium">{evento.nome_y}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tamanho da Fonte:</span>
                  <span className="font-medium">{evento.nome_font_size}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Família da Fonte:</span>
                  <span className="font-medium">{evento.nome_font_family}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  Template Preview
                </h3>
                <p className="text-sm text-gray-600">
                  Visualização do template configurado
                </p>
              </div>
              <img
                src={evento.template_url || '/placeholder.svg'}
                alt="Template"
                className="w-32 h-24 object-cover rounded border"
              />
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Exportar CSV
          </button>
          <Link
            href={`/${evento.slug}`}
            target="_blank"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Ver Landing Page
          </Link>
        </div>

        {/* Lista de Participações */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Participações Recentes</h2>
          </div>

          {evento.participacoes.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhuma participação ainda
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    {evento.campo_extra_label && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {evento.campo_extra_label}
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evento.participacoes.map((participacao) => (
                    <tr key={participacao.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={participacao.foto_url || '/placeholder.svg'}
                            alt={participacao.nome}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                          <div className="text-sm font-medium text-gray-900">
                            {participacao.nome}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {participacao.empresa}
                        </div>
                      </td>
                      {evento.campo_extra_label && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {participacao.campo_extra_valor || '-'}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(participacao.created_at).toLocaleDateString(
                          'pt-BR'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={participacao.card_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Ver Card
                        </a>
                        <a
                          href={participacao.foto_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-900"
                        >
                          Ver Foto
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
