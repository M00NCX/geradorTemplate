import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Gera um slug a partir de uma string.
 * @param text A string para gerar o slug.
 * @returns O slug gerado.
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * Gera um nome de arquivo único com base no nome original e um timestamp.
 * @param originalFileName O nome original do arquivo.
 * @returns Um nome de arquivo único.
 */
export function generateUniqueFileName(originalFileName: string): string {
  const timestamp = Date.now();
  const extension = originalFileName.split('.').pop();
  const name = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
  return `${generateSlug(name)}-${timestamp}.${extension}`;
}
