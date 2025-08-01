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
      include: {
        participacoes: {
          orderBy: {
            created_at: 'desc',
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

    // Criar CSV
    const headers = ['Nome', 'Empresa'];
    if (evento.campo_extra_label) {
      headers.push(evento.campo_extra_label);
    }
    headers.push('Data de Cadastro', 'URL da Foto', 'URL do Card');

    const csvRows = [headers.join(',')];

    for (const participacao of evento.participacoes) {
      const row = [`"${participacao.nome}"`, `"${participacao.empresa}"`];

      if (evento.campo_extra_label) {
        row.push(`"${participacao.campo_extra_valor || ''}"`);
      }

      row.push(
        `"${participacao.created_at.toLocaleDateString('pt-BR')}"`,
        `"${participacao.foto_url}"`,
        `"${participacao.card_url}"`
      );

      csvRows.push(row.join(','));
    }

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${evento.slug}-participacoes.csv"`,
      },
    });
  } catch (error) {
    console.error('Erro ao exportar dados:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
