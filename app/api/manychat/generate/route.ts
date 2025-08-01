// app/api/manychat/generate/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';
import path from 'path';
import { generateUniqueFileName } from '@/lib/utils';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // 1. Receber os dados JSON do ManyChat
    const body = await request.json();
    const { nome, empresa, foto_url_externa, slug_evento, campo_extra_valor } =
      body;

    // Validação básica dos dados recebidos
    if (!nome || !empresa || !foto_url_externa || !slug_evento) {
      return NextResponse.json(
        { error: 'Dados insuficientes recebidos do ManyChat.' },
        { status: 400 }
      );
    }

    // 2. Buscar as configurações do evento
    const evento = await prisma.evento.findUnique({
      where: { slug: slug_evento },
    });
    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado.' },
        { status: 404 }
      );
    }

    // 3. Baixar a foto enviada pelo usuário via URL
    const fotoResponse = await fetch(foto_url_externa);
    if (!fotoResponse.ok) {
      throw new Error('Não foi possível baixar a imagem do usuário.');
    }
    const fotoBufferOriginal = Buffer.from(await fotoResponse.arrayBuffer());

    // Salvar a foto baixada no diretório /public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }
    const fotoFileName = generateUniqueFileName('perfil.jpg');
    const fotoPath = path.join(uploadsDir, fotoFileName);
    await writeFile(fotoPath, fotoBufferOriginal);
    const fotoUrlLocal = `/uploads/${fotoFileName}`;

    // --- A partir daqui, a lógica é muito similar à sua rota /api/generate ---

    // 4. Gerar o card usando Sharp
    const cardsDir = path.join(process.cwd(), 'public', 'cards');
    if (!existsSync(cardsDir)) {
      await mkdir(cardsDir, { recursive: true });
    }

    const templatePath = path.join(
      process.cwd(),
      'public',
      evento.template_url
    );
    const cardFileName = generateUniqueFileName('card.png');
    const cardPath = path.join(cardsDir, cardFileName);
    const cardUrlFinal = `/cards/${cardFileName}`;

    const template = sharp(templatePath);
    const templateMetadata = await template.metadata();

    let fotoProcessada = sharp(fotoBufferOriginal).resize(
      evento.foto_width,
      evento.foto_height,
      {
        fit: 'cover',
        position: 'center',
      }
    );

    if (evento.foto_shape === 'circle') {
      const circleSize = Math.min(evento.foto_width, evento.foto_height);
      const circleMask = Buffer.from(
        `<svg><circle cx="${circleSize / 2}" cy="${circleSize / 2}" r="${
          circleSize / 2
        }" fill="white"/></svg>`
      );
      fotoProcessada = fotoProcessada
        .resize(circleSize, circleSize, { fit: 'cover' })
        .composite([{ input: circleMask, blend: 'dest-in' }]);
    }

    const fotoBufferProcessado = await fotoProcessada.png().toBuffer();

    const svgText = `
      <svg width="${templateMetadata.width}" height="${templateMetadata.height}">
        <style>
          .nome { font-family: "${evento.nome_font_family}", Arial, sans-serif; font-size: ${evento.nome_font_size}px; font-weight: bold; fill: #1f2937; text-anchor: middle; }
        </style>
        <text x="${evento.nome_x}" y="${evento.nome_y}" class="nome">${nome}</text>
      </svg>
    `;

    await template
      .composite([
        {
          input: fotoBufferProcessado,
          top: evento.foto_y,
          left: evento.foto_x,
        },
        { input: Buffer.from(svgText), top: 0, left: 0 },
      ])
      .png()
      .toFile(cardPath);

    // 5. Salvar a participação no banco de dados
    await prisma.participacao.create({
      data: {
        nome,
        empresa,
        campo_extra_valor: campo_extra_valor || null,
        foto_url: fotoUrlLocal, // Salvamos a URL local da foto baixada
        card_url: cardUrlFinal,
        evento_id: evento.id,
      },
    });

    // 6. Retornar a URL do card gerado para o ManyChat
    return NextResponse.json({
      card_url: `${process.env.NEXT_PUBLIC_BASE_URL}${cardUrlFinal}`, // URL completa
    });
  } catch (error) {
    console.error('Erro na geração via ManyChat:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar o card.' },
      { status: 500 }
    );
  }
}
