'use client';

import type React from 'react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Evento {
  id: number;
  nome_evento: string;
  slug: string;
  template_url: string;
  campo_extra_label: string | null;
  created_at: string;
  _count: {
    participacoes: number;
  };
}

interface ResizeHandle {
  type: 'foto' | 'nome';
  corner: 'se' | 'sw' | 'ne' | 'nw' | 'move';
}

const FONTES_DISPONIVEIS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'Lucida Console', label: 'Lucida Console' },
];

export default function AdminPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nome_evento: '',
    campo_extra_label: '',
    foto_x: 100,
    foto_y: 100,
    foto_width: 200,
    foto_height: 200,
    foto_shape: 'square' as 'square' | 'circle',
    nome_x: 300,
    nome_y: 150,
    nome_font_size: 32,
    nome_font_family: 'Arial',
  });
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [templatePreviewUrl, setTemplatePreviewUrl] = useState<string | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState<ResizeHandle | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await fetch('/api/admin/eventos');
      const data = await response.json();
      setEventos(data.eventos);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setTemplateFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTemplatePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setTemplatePreviewUrl(null);
    }
  };

  const getScaleFactors = () => {
    if (!imageRef.current) return { scaleX: 1, scaleY: 1 };
    const rect = imageRef.current.getBoundingClientRect();
    return {
      scaleX: imageRef.current.naturalWidth / rect.width,
      scaleY: imageRef.current.naturalHeight / rect.height,
    };
  };

  const handleMouseDown = (e: React.MouseEvent, handle: ResizeHandle) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current) return;

    const { scaleX, scaleY } = getScaleFactors();
    const deltaX = (e.clientX - dragStart.x) * scaleX;
    const deltaY = (e.clientY - dragStart.y) * scaleY;

    if (isDragging.type === 'foto') {
      if (isDragging.corner === 'move') {
        setFormData((prev) => ({
          ...prev,
          foto_x: Math.max(0, prev.foto_x + deltaX),
          foto_y: Math.max(0, prev.foto_y + deltaY),
        }));
      } else if (isDragging.corner === 'se') {
        setFormData((prev) => ({
          ...prev,
          foto_width: Math.max(50, prev.foto_width + deltaX),
          foto_height: Math.max(50, prev.foto_height + deltaY),
        }));
      }
    } else if (isDragging.type === 'nome') {
      if (isDragging.corner === 'move') {
        setFormData((prev) => ({
          ...prev,
          nome_x: Math.max(0, prev.nome_x + deltaX),
          nome_y: Math.max(0, prev.nome_y + deltaY),
        }));
      } else if (isDragging.corner === 'se') {
        const newSize = Math.max(12, formData.nome_font_size + deltaY / 2);
        setFormData((prev) => ({
          ...prev,
          nome_font_size: Math.round(Math.min(200, newSize)), // Máximo de 200px
        }));
      }
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateFile) {
      alert('Por favor, selecione um template');
      return;
    }

    if (formData.foto_width <= 0 || formData.foto_height <= 0) {
      alert('Largura e altura da foto devem ser maiores que zero.');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('nome_evento', formData.nome_evento);
      formDataToSend.append('campo_extra_label', formData.campo_extra_label);
      formDataToSend.append('template', templateFile);
      formDataToSend.append('foto_x', Math.round(formData.foto_x).toString());
      formDataToSend.append('foto_y', Math.round(formData.foto_y).toString());
      formDataToSend.append(
        'foto_width',
        Math.round(formData.foto_width).toString()
      );
      formDataToSend.append(
        'foto_height',
        Math.round(formData.foto_height).toString()
      );
      formDataToSend.append('foto_shape', formData.foto_shape);
      formDataToSend.append('nome_x', Math.round(formData.nome_x).toString());
      formDataToSend.append('nome_y', Math.round(formData.nome_y).toString());
      formDataToSend.append(
        'nome_font_size',
        Math.round(formData.nome_font_size).toString()
      );
      formDataToSend.append('nome_font_family', formData.nome_font_family);

      const response = await fetch('/api/admin/create-event', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Evento criado com sucesso!');
        setFormData({
          nome_evento: '',
          campo_extra_label: '',
          foto_x: 100,
          foto_y: 100,
          foto_width: 200,
          foto_height: 200,
          foto_shape: 'square',
          nome_x: 300,
          nome_y: 150,
          nome_font_size: 32,
          nome_font_family: 'Arial',
        });
        setTemplateFile(null);
        setTemplatePreviewUrl(null);
        setShowForm(false);
        fetchEventos();
      } else {
        alert(result.error || 'Erro ao criar evento');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="mt-2 text-gray-600">
            Gerencie eventos e templates do sistema
          </p>
        </div>

        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {showForm ? 'Cancelar' : 'Novo Evento'}
          </button>

          <Link
            href="/admin/help"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block"
          >
            Como Criar Templates
          </Link>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Criar Novo Evento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Evento *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome_evento}
                    onChange={(e) =>
                      setFormData({ ...formData, nome_evento: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Conferência Tech 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Label do Campo Extra (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.campo_extra_label}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        campo_extra_label: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Cargo, Área de Atuação, etc."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Nota: Este campo será coletado mas não aparecerá no template
                    final
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template PNG/JPG *
                </label>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  required
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Formatos aceitos: PNG, JPG, JPEG
                </p>
              </div>

              {templatePreviewUrl && (
                <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50">
                  <h3 className="text-lg font-semibold mb-2">
                    Editor de Template
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Arraste os elementos para posicioná-los. Use as alças de
                    redimensionamento para ajustar o tamanho.
                    <br />
                    <strong>Importante:</strong> Apenas o nome e a foto
                    aparecerão no template final.
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Preview da imagem */}
                    <div className="lg:col-span-2">
                      <div
                        ref={containerRef}
                        className="relative inline-block border-2 border-dashed border-gray-300 bg-white"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      >
                        <img
                          ref={imageRef}
                          src={templatePreviewUrl || '/placeholder.svg'}
                          alt="Template Preview"
                          className="max-w-full h-auto"
                          style={{ maxHeight: '500px' }}
                        />

                        {/* Área da foto */}
                        <div
                          className="absolute border-2 border-red-500 bg-red-100 bg-opacity-30 cursor-move"
                          style={{
                            left: `${
                              (formData.foto_x /
                                (imageRef.current?.naturalWidth || 1)) *
                              100
                            }%`,
                            top: `${
                              (formData.foto_y /
                                (imageRef.current?.naturalHeight || 1)) *
                              100
                            }%`,
                            width: `${
                              (formData.foto_width /
                                (imageRef.current?.naturalWidth || 1)) *
                              100
                            }%`,
                            height: `${
                              (formData.foto_height /
                                (imageRef.current?.naturalHeight || 1)) *
                              100
                            }%`,
                            borderRadius:
                              formData.foto_shape === 'circle' ? '50%' : '0',
                          }}
                          onMouseDown={(e) =>
                            handleMouseDown(e, { type: 'foto', corner: 'move' })
                          }
                        >
                          <span className="absolute -top-6 left-0 text-red-600 text-xs font-bold bg-white px-1 rounded">
                            Foto (
                            {formData.foto_shape === 'circle'
                              ? 'Circular'
                              : 'Quadrada'}
                            )
                          </span>

                          {/* Alça de redimensionamento da foto */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-red-600 cursor-se-resize"
                            onMouseDown={(e) =>
                              handleMouseDown(e, { type: 'foto', corner: 'se' })
                            }
                          />
                        </div>

                        {/* Área do nome */}
                        <div
                          className="absolute border-2 border-green-500 bg-green-100 bg-opacity-30 cursor-move flex items-center justify-center"
                          style={{
                            left: `${
                              (formData.nome_x /
                                (imageRef.current?.naturalWidth || 1)) *
                              100
                            }%`,
                            top: `${
                              (formData.nome_y /
                                (imageRef.current?.naturalHeight || 1)) *
                              100
                            }%`,
                            width: `${Math.max(
                              150,
                              formData.nome_font_size * 6
                            )}px`,
                            height: `${formData.nome_font_size + 20}px`,
                            fontSize: `${Math.max(
                              8,
                              formData.nome_font_size / 4
                            )}px`,
                            fontFamily: formData.nome_font_family,
                            transform: 'translate(-50%, -50%)',
                          }}
                          onMouseDown={(e) =>
                            handleMouseDown(e, { type: 'nome', corner: 'move' })
                          }
                        >
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-green-600 text-xs font-bold bg-white px-1 rounded whitespace-nowrap">
                            Nome ({formData.nome_font_size}px -{' '}
                            {formData.nome_font_family})
                          </span>
                          <span className="text-center font-bold">
                            NOME AQUI
                          </span>

                          {/* Alça de redimensionamento do nome */}
                          <div
                            className="absolute bottom-0 right-0 w-3 h-3 bg-green-600 cursor-se-resize"
                            onMouseDown={(e) =>
                              handleMouseDown(e, { type: 'nome', corner: 'se' })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="space-y-4">
                      <div className="bg-red-50 p-3 rounded-md">
                        <h4 className="font-semibold text-red-800 mb-2">
                          Configurações da Foto
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <label className="block text-gray-700">X:</label>
                            <input
                              type="number"
                              value={Math.round(formData.foto_x)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  foto_x: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">Y:</label>
                            <input
                              type="number"
                              value={Math.round(formData.foto_y)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  foto_y: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">
                              Largura:
                            </label>
                            <input
                              type="number"
                              value={Math.round(formData.foto_width)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  foto_width:
                                    Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">
                              Altura:
                            </label>
                            <input
                              type="number"
                              value={Math.round(formData.foto_height)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  foto_height:
                                    Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                        </div>
                        <div className="mt-2">
                          <label className="block text-gray-700 text-sm">
                            Formato:
                          </label>
                          <select
                            value={formData.foto_shape}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                foto_shape: e.target.value as
                                  | 'square'
                                  | 'circle',
                              })
                            }
                            className="w-full px-2 py-1 border rounded text-sm"
                          >
                            <option value="square">Quadrada</option>
                            <option value="circle">Circular</option>
                          </select>
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-md">
                        <h4 className="font-semibold text-green-800 mb-2">
                          Configurações do Nome
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <label className="block text-gray-700">X:</label>
                            <input
                              type="number"
                              value={Math.round(formData.nome_x)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  nome_x: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700">Y:</label>
                            <input
                              type="number"
                              value={Math.round(formData.nome_y)}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  nome_y: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-gray-700">
                              Tamanho da Fonte (12-200px):
                            </label>
                            <input
                              type="number"
                              min="12"
                              max="200"
                              value={formData.nome_font_size}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  nome_font_size: Math.min(
                                    200,
                                    Math.max(
                                      12,
                                      Number.parseInt(e.target.value) || 32
                                    )
                                  ),
                                })
                              }
                              className="w-full px-2 py-1 border rounded"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-gray-700">
                              Fonte:
                            </label>
                            <select
                              value={formData.nome_font_family}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  nome_font_family: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border rounded text-sm"
                            >
                              {FONTES_DISPONIVEIS.map((fonte) => (
                                <option key={fonte.value} value={fonte.value}>
                                  {fonte.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium transition-colors"
              >
                {submitting ? 'Criando...' : 'Criar Evento'}
              </button>
            </form>
          </div>
        )}

        {/* Lista de Eventos */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Eventos Cadastrados</h2>
          </div>

          {eventos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nenhum evento cadastrado ainda
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome do Evento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Criação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventos.map((evento) => (
                    <tr key={evento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {evento.nome_evento}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {evento.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {evento._count.participacoes}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(evento.created_at).toLocaleDateString(
                          'pt-BR'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          href={`/admin/evento/${evento.slug}`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Monitorar
                        </Link>
                        <Link
                          href={`/${evento.slug}`}
                          target="_blank"
                          className="text-green-600 hover:text-green-900"
                        >
                          Ver Landing
                        </Link>
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
