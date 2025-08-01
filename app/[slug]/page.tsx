'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Evento {
  id: number;
  nome_evento: string;
  slug: string;
  campo_extra_label: string | null;
  participacoes: number;
}

export default function EventoPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    campo_extra_valor: '',
  });
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cardGerado, setCardGerado] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchEvento();
    }
  }, [slug]);

  const fetchEvento = async () => {
    try {
      const response = await fetch(`/api/evento/${slug}`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fotoFile) {
      alert('Por favor, selecione uma foto');
      return;
    }

    setSubmitting(true);

    try {
      // Primeiro, fazer upload da foto
      const uploadFormData = new FormData();
      uploadFormData.append('file', fotoFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(uploadResult.error || 'Erro no upload da foto');
      }

      // Depois, gerar o card
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          empresa: formData.empresa,
          campo_extra_valor: formData.campo_extra_valor || null,
          foto_url: uploadResult.file_url,
          slug_evento: slug,
        }),
      });

      const generateResult = await generateResponse.json();

      if (generateResponse.ok) {
        setCardGerado(generateResult.card_url);
      } else {
        throw new Error(generateResult.error || 'Erro na geração do card');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert(error instanceof Error ? error.message : 'Erro desconhecido');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (cardGerado) {
      const link = document.createElement('a');
      link.href = cardGerado;
      link.download = `card-${evento?.slug}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
          <p className="text-gray-600">
            O evento que você está procurando não existe ou foi removido.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {evento.nome_evento}
              </h1>
              <p className="text-gray-600">
                Crie seu card personalizado para o evento
              </p>
              <div className="mt-2 text-sm text-blue-600">
                ✨ Apenas seu nome e foto aparecerão no card final
              </div>
            </div>

            {!cardGerado ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite seu nome completo"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este nome aparecerá no seu card
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da sua Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.empresa}
                    onChange={(e) =>
                      setFormData({ ...formData, empresa: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digite o nome da sua empresa"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Para controle interno - não aparece no card
                  </p>
                </div>

                {evento.campo_extra_label && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {evento.campo_extra_label}
                    </label>
                    <input
                      type="text"
                      value={formData.campo_extra_valor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          campo_extra_valor: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={`Digite seu(a) ${evento.campo_extra_label.toLowerCase()}`}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Para controle interno - não aparece no card
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sua Foto *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setFotoFile(e.target.files?.[0] || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Formatos aceitos: JPG, PNG, WEBP. Máximo 5MB. Esta foto
                    aparecerá no seu card.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Gerando seu card...
                    </div>
                  ) : (
                    'Gerar Meu Card'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Seu card está pronto!
                </h2>
                <div className="mb-6">
                  <img
                    src={cardGerado || '/placeholder.svg'}
                    alt="Card gerado"
                    className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="space-y-4">
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-md font-medium transition-colors"
                  >
                    Baixar Imagem
                  </button>
                  <div>
                    <button
                      onClick={() => {
                        setCardGerado(null);
                        setFormData({
                          nome: '',
                          empresa: '',
                          campo_extra_valor: '',
                        });
                        setFotoFile(null);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Criar outro card
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
