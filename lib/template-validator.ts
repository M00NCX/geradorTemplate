import { detectPlaceholder } from './placeholder-detector';

interface TemplateValidationResult {
  isValid: boolean;
  error?: string;
  placeholder?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

/**
 * Valida se um template possui placeholder válido para foto
 */
export async function validateTemplate(
  templatePath: string
): Promise<TemplateValidationResult> {
  try {
    // Detectar placeholder no template
    const placeholder = await detectPlaceholder(templatePath);

    if (!placeholder) {
      return {
        isValid: false,
        error:
          'Template deve conter um retângulo magenta (#FF00FF) para marcar a posição da foto do usuário',
      };
    }

    // Validar dimensões mínimas do placeholder
    if (placeholder.width < 50 || placeholder.height < 50) {
      return {
        isValid: false,
        error: 'Área do placeholder deve ter pelo menos 50x50 pixels',
      };
    }

    // Validar se o placeholder não está muito próximo das bordas
    // (assumindo template mínimo de 400x300)
    if (placeholder.x < 10 || placeholder.y < 10) {
      return {
        isValid: false,
        error:
          'Placeholder deve estar pelo menos 10 pixels distante das bordas',
      };
    }

    return {
      isValid: true,
      placeholder,
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Erro ao processar template: ${
        error instanceof Error ? error.message : 'Erro desconhecido'
      }`,
    };
  }
}

/**
 * Gera um template de exemplo com placeholder
 */
export function generateExampleTemplate(): string {
  return `
    Para criar um template válido:
    
    1. Crie uma imagem PNG com as dimensões desejadas
    2. Adicione um retângulo da cor magenta (#FF00FF) onde a foto do usuário deve aparecer
    3. O retângulo deve ter pelo menos 50x50 pixels
    4. Deixe espaço abaixo da área da foto para os textos (nome, empresa)
    
    Exemplo de cores:
    - Fundo: Qualquer cor ou imagem
    - Placeholder da foto: #FF00FF (magenta puro)
    - Textos serão adicionados automaticamente abaixo da foto
  `;
}

// Este arquivo não é mais necessário para a validação de templates, pois a seleção de coordenadas é manual.
// Ele pode ser removido se não houver outras dependências.
// Por brevidade, seu conteúdo foi omitido.
