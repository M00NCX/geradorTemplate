import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import path from 'path';
import { generateUniqueFileName } from '@/lib/utils';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { nome, empresa, foto_url, slug_evento, campo_extra_valor } =
      await request.json();

    if (!nome || !empresa || !foto_url || !slug_evento) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    // Buscar evento no banco de dados com todas as configurações
    const evento = await prisma.evento.findUnique({
      where: { slug: slug_evento },
    });

    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    // Criar diretório de cards se não existir
    const cardsDir = path.join(process.cwd(), 'public', 'cards');
    if (!existsSync(cardsDir)) {
      await mkdir(cardsDir, { recursive: true });
    }

    // Caminhos dos arquivos
    const templatePath = path.join(
      process.cwd(),
      'public',
      evento.template_url
    );
    const fotoPath = path.join(process.cwd(), 'public', foto_url);

    // Gerar nome único para o card
    const cardFileName = generateUniqueFileName('card.png');
    const cardPath = path.join(cardsDir, cardFileName);
    const cardUrl = `/cards/${cardFileName}`;

    // Processar imagem com Sharp usando coordenadas dinâmicas
    const template = sharp(templatePath);
    const templateMetadata = await template.metadata();

    // Redimensionar foto do usuário para as dimensões exatas configuradas
    let fotoProcessada = sharp(fotoPath).resize(
      evento.foto_width,
      evento.foto_height,
      {
        fit: 'cover',
        position: 'center',
      }
    );

    // Aplicar formato circular se necessário
    if (evento.foto_shape === 'circle') {
      // Criar máscara circular
      const circleSize = Math.min(evento.foto_width, evento.foto_height);
      const circleMask = Buffer.from(
        `<svg width="${circleSize}" height="${circleSize}">
          <circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${
          circleSize / 2
        }" fill="white"/>
        </svg>`
      );

      fotoProcessada = fotoProcessada
        .resize(circleSize, circleSize, { fit: 'cover' })
        .composite([{ input: circleMask, blend: 'dest-in' }]);
    }

    const fotoBuffer = await fotoProcessada.png().toBuffer();

    // Usar as coordenadas do nome diretamente do banco de dados
    const nomeX = evento.nome_x;
    const nomeY = evento.nome_y;
    const nomeFontSize = evento.nome_font_size;
    const nomeFontFamily = evento.nome_font_family;

    // Criar SVG apenas com o nome (removendo empresa e campo extra)
    const svgText = `
      <svg width="${templateMetadata.width}" height="${templateMetadata.height}">
        <defs>
          <style>
            .nome { 
              font-family: ${nomeFontFamily}, Arial, sans-serif; 
              font-size: ${nomeFontSize}px; 
              font-weight: bold; 
              fill: #1f2937; 
              text-anchor: middle;
            }
          </style>
        </defs>
        <text x="${nomeX}" y="${nomeY}" class="nome">${nome}</text>
      </svg>
    `;

    // Compor imagem final usando as coordenadas dinâmicas
    await template
      .composite([
        {
          input: fotoBuffer,
          top: evento.foto_y,
          left: evento.foto_x,
        },
        {
          input: Buffer.from(svgText),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toFile(cardPath);

    // Salvar participação no banco de dados
    const participacao = await prisma.participacao.create({
      data: {
        nome,
        empresa,
        campo_extra_valor: campo_extra_valor || null,
        foto_url,
        card_url: cardUrl,
        evento_id: evento.id,
      },
    });

    return NextResponse.json({
      status: 'ok',
      card_url: cardUrl,
      participacao_id: participacao.id,
      configuracoes_usadas: {
        foto_x: evento.foto_x,
        foto_y: evento.foto_y,
        foto_width: evento.foto_width,
        foto_height: evento.foto_height,
        foto_shape: evento.foto_shape,
        nome_x: evento.nome_x,
        nome_y: evento.nome_y,
        nome_font_size: evento.nome_font_size,
        nome_font_family: evento.nome_font_family,
      },
      message:
        'Card gerado com sucesso! Apenas nome e foto foram incluídos no template.',
    });
  } catch (error) {
    console.error('Erro na geração do card:', error);
    return NextResponse.json(
      { error: 'Erro na geração do card' },
      { status: 500 }
    );
  }
}
