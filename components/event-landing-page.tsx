'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Users, CheckCircle } from 'lucide-react';

interface Evento {
  id: number;
  nome_evento: string;
  slug: string;
  campo_extra_label: string | null;
  _count: {
    participacoes: number;
  };
}

interface EventLandingPageProps {
  evento: Evento;
}

export default function EventLandingPage({ evento }: EventLandingPageProps) {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    campo_extra_valor: '',
  });
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cardUrl, setCardUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!foto) {
      alert('Por favor, selecione uma foto');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('evento_slug', evento.slug);
      formDataToSend.append('nome', formData.nome);
      formDataToSend.append('empresa', formData.empresa);
      formDataToSend.append('campo_extra_valor', formData.campo_extra_valor);
      formDataToSend.append('foto', foto);

      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setCardUrl(result.card_url);
      } else {
        alert(result.error || 'Erro ao gerar card');
      }
    } catch (error) {
      console.error('Erro ao gerar card:', error);
      alert('Erro ao gerar card');
    } finally {
      setLoading(false);
    }
  };

  if (success && cardUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">
              Card Gerado com Sucesso!
            </CardTitle>
            <CardDescription>
              Seu card personalizado está pronto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <img
                src={cardUrl || '/placeholder.svg'}
                alt="Seu card personalizado"
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
            </div>
            <div className="flex space-x-2">
              <Button asChild className="flex-1">
                <a href={cardUrl} download>
                  Baixar Card
                </a>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setCardUrl(null);
                  setFormData({ nome: '', empresa: '', campo_extra_valor: '' });
                  setFoto(null);
                }}
                className="flex-1"
              >
                Criar Outro
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {evento.nome_evento}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Crie seu card personalizado para o evento
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>{evento._count.participacoes} participantes</span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Preencha seus dados para gerar seu card personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="empresa">Empresa *</Label>
                  <Input
                    id="empresa"
                    type="text"
                    required
                    value={formData.empresa}
                    onChange={(e) =>
                      setFormData({ ...formData, empresa: e.target.value })
                    }
                    placeholder="Nome da sua empresa"
                  />
                </div>

                {evento.campo_extra_label && (
                  <div>
                    <Label htmlFor="campo_extra">
                      {evento.campo_extra_label}
                    </Label>
                    <Input
                      id="campo_extra"
                      type="text"
                      value={formData.campo_extra_valor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          campo_extra_valor: e.target.value,
                        })
                      }
                      placeholder={`Seu ${evento.campo_extra_label.toLowerCase()}`}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="foto">Sua Foto *</Label>
                  <div className="mt-2">
                    <Input
                      id="foto"
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setFoto(e.target.files?.[0] || null)}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Formatos aceitos: JPG, PNG. Tamanho máximo: 10MB
                  </p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Gerando Card...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Gerar Meu Card
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
