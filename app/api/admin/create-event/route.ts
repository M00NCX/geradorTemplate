import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateSlug, generateUniqueFileName } from '@/lib/utils';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const nomeEvento = formData.get('nome_evento') as string;
    const campoExtraLabel = formData.get('campo_extra_label') as string;
    const templateFile = formData.get('template') as File;

    // Coordenadas e configurações recebidas do frontend
    const fotoX = Number.parseInt(formData.get('foto_x') as string);
    const fotoY = Number.parseInt(formData.get('foto_y') as string);
    const fotoWidth = Number.parseInt(formData.get('foto_width') as string);
    const fotoHeight = Number.parseInt(formData.get('foto_height') as string);
    const fotoShape = (formData.get('foto_shape') as string) || 'square';
    const nomeX = Number.parseInt(formData.get('nome_x') as string);
    const nomeY = Number.parseInt(formData.get('nome_y') as string);
    const nomeFontSize =
      Number.parseInt(formData.get('nome_font_size') as string) || 32;
    const nomeFontFamily =
      (formData.get('nome_font_family') as string) || 'Arial';

    if (
      !nomeEvento ||
      !templateFile ||
      isNaN(fotoX) ||
      isNaN(fotoY) ||
      isNaN(fotoWidth) ||
      isNaN(fotoHeight) ||
      isNaN(nomeX) ||
      isNaN(nomeY)
    ) {
      return NextResponse.json(
        {
          error:
            'Todos os campos obrigatórios (nome do evento, template e coordenadas) devem ser preenchidos',
        },
        { status: 400 }
      );
    }

    // Validar formato da foto
    if (!['square', 'circle'].includes(fotoShape)) {
      return NextResponse.json(
        { error: "Formato da foto deve ser 'square' ou 'circle'" },
        { status: 400 }
      );
    }

    // Gerar slug único
    let slug = generateSlug(nomeEvento);
    let slugExists = await prisma.evento.findUnique({ where: { slug } });
    let counter = 1;

    while (slugExists) {
      slug = `${generateSlug(nomeEvento)}-${counter}`;
      slugExists = await prisma.evento.findUnique({ where: { slug } });
      counter++;
    }

    // Criar diretório de templates se não existir
    const templatesDir = path.join(process.cwd(), 'public', 'templates');
    if (!existsSync(templatesDir)) {
      await mkdir(templatesDir, { recursive: true });
    }

    // Salvar template no servidor
    const bytes = await templateFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = generateUniqueFileName(templateFile.name);
    const templatePath = path.join(templatesDir, fileName);

    await writeFile(templatePath, buffer);
    const templateUrl = `/templates/${fileName}`;

    // Criar evento no banco de dados com as coordenadas fornecidas
    const evento = await prisma.evento.create({
      data: {
        nome_evento: nomeEvento,
        slug,
        template_url: templateUrl,
        campo_extra_label: campoExtraLabel || null,
        foto_x: fotoX,
        foto_y: fotoY,
        foto_width: fotoWidth,
        foto_height: fotoHeight,
        foto_shape: fotoShape,
        nome_x: nomeX,
        nome_y: nomeY,
        nome_font_size: nomeFontSize,
        nome_font_family: nomeFontFamily,
      },
    });

    return NextResponse.json({
      status: 'ok',
      evento,
      message:
        'Evento criado com sucesso! Coordenadas e configurações definidas manualmente.',
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
