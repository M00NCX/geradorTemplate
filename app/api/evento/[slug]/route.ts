import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const evento = await prisma.evento.findUnique({
      where: { slug },
      select: {
        id: true,
        nome_evento: true,
        slug: true,
        campo_extra_label: true,
        _count: {
          select: {
            participacoes: true,
          },
        },
      },
    });

    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'ok',
      evento,
    });
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
