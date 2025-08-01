import sharp from 'sharp';

// Cor do placeholder em formato RGB
const PLACEHOLDER_COLOR = { r: 255, g: 0, b: 255 }; // Magenta #FF00FF

interface PlaceholderCoordinates {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Detecta o placeholder magenta (#FF00FF) em uma imagem PNG
 * e retorna suas coordenadas e dimensões
 * NOTA: Esta função não é mais usada na criação de eventos, mas pode ser útil para outras validações ou ferramentas.
 */
export async function detectPlaceholder(
  imagePath: string
): Promise<PlaceholderCoordinates | null> {
  try {
    // Carregar a imagem e obter informações
    const image = sharp(imagePath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;

    // Verificar se a imagem tem pelo menos 3 canais (RGB)
    if (channels < 3) {
      throw new Error('Imagem deve ter pelo menos 3 canais (RGB)');
    }

    // Procurar pelo primeiro pixel magenta
    let startX = -1;
    let startY = -1;

    // Varrer a imagem pixel por pixel
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixelIndex = (y * width + x) * channels;
        const r = data[pixelIndex];
        const g = data[pixelIndex + 1];
        const b = data[pixelIndex + 2];

        // Verificar se o pixel é magenta
        if (
          r === PLACEHOLDER_COLOR.r &&
          g === PLACEHOLDER_COLOR.g &&
          b === PLACEHOLDER_COLOR.b
        ) {
          startX = x;
          startY = y;
          break;
        }
      }
      if (startX !== -1) break;
    }

    // Se não encontrou nenhum pixel magenta
    if (startX === -1 || startY === -1) {
      return null;
    }

    // Encontrar as dimensões do retângulo magenta
    const bounds = findRectangleBounds(
      data,
      width,
      height,
      channels,
      startX,
      startY
    );

    return bounds;
  } catch (error) {
    console.error('Erro ao detectar placeholder:', error);
    return null;
  }
}

/**
 * Encontra os limites do retângulo magenta a partir de um ponto inicial
 */
function findRectangleBounds(
  data: Buffer,
  imageWidth: number,
  imageHeight: number,
  channels: number,
  startX: number,
  startY: number
): PlaceholderCoordinates {
  // Encontrar limite direito
  let rightX = startX;
  for (let x = startX; x < imageWidth; x++) {
    const pixelIndex = (startY * imageWidth + x) * channels;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];

    if (
      r === PLACEHOLDER_COLOR.r &&
      g === PLACEHOLDER_COLOR.g &&
      b === PLACEHOLDER_COLOR.b
    ) {
      rightX = x;
    } else {
      break;
    }
  }

  // Encontrar limite inferior
  let bottomY = startY;
  for (let y = startY; y < imageHeight; y++) {
    const pixelIndex = (y * imageWidth + startX) * channels;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];

    if (
      r === PLACEHOLDER_COLOR.r &&
      g === PLACEHOLDER_COLOR.g &&
      b === PLACEHOLDER_COLOR.b
    ) {
      bottomY = y;
    } else {
      break;
    }
  }

  // Encontrar limite esquerdo (procurar para trás a partir do startX)
  let leftX = startX;
  for (let x = startX; x >= 0; x--) {
    const pixelIndex = (startY * imageWidth + x) * channels;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];

    if (
      r === PLACEHOLDER_COLOR.r &&
      g === PLACEHOLDER_COLOR.g &&
      b === PLACEHOLDER_COLOR.b
    ) {
      leftX = x;
    } else {
      break;
    }
  }

  // Encontrar limite superior (procurar para cima a partir do startY)
  let topY = startY;
  for (let y = startY; y >= 0; y--) {
    const pixelIndex = (y * imageWidth + leftX) * channels;
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];

    if (
      r === PLACEHOLDER_COLOR.r &&
      g === PLACEHOLDER_COLOR.g &&
      b === PLACEHOLDER_COLOR.b
    ) {
      topY = y;
    } else {
      break;
    }
  }

  return {
    x: leftX,
    y: topY,
    width: rightX - leftX + 1,
    height: bottomY - topY + 1,
  };
}

/**
 * Remove o placeholder magenta do template, substituindo por transparência
 * NOTA: Esta função não é mais usada na criação de eventos, mas pode ser útil para outras validações ou ferramentas.
 */
export async function removePlaceholder(
  imagePath: string,
  outputPath: string
): Promise<void> {
  try {
    const image = sharp(imagePath);
    const { data, info } = await image
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const newData = Buffer.from(data);

    // Substituir pixels magenta por transparência (se a imagem suportar alpha)
    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      if (
        r === PLACEHOLDER_COLOR.r &&
        g === PLACEHOLDER_COLOR.g &&
        b === PLACEHOLDER_COLOR.b
      ) {
        // Tornar o pixel transparente (preto com alpha 0)
        newData[i] = 0; // R
        newData[i + 1] = 0; // G
        newData[i + 2] = 0; // B
        if (channels === 4) {
          newData[i + 3] = 0; // Alpha
        }
      }
    }

    // Salvar a imagem processada
    await sharp(newData, {
      raw: {
        width,
        height,
        channels,
      },
    })
      .png()
      .toFile(outputPath);
  } catch (error) {
    console.error('Erro ao remover placeholder:', error);
    throw error;
  }
}
