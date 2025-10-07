import type { Dictionary } from '@/lib/i18n-types';

export type TranslationParams = Record<string, string | number>;

type DictionaryValue = string | number | DictionaryTree | DictionaryValue[];
type DictionaryTree = { [key: string]: DictionaryValue };

function resolveValue(dictionary: DictionaryTree, key: string): string {
  const segments = key.split('.');
  let current: DictionaryValue | undefined = dictionary;

  for (const segment of segments) {
    if (Array.isArray(current) || typeof current !== 'object' || current === null) {
      throw new Error(`Missing translation for key "${key}"`);
    }

    current = current[segment];
  }

  if (typeof current !== 'string' && typeof current !== 'number') {
    throw new Error(`Missing translation for key "${key}"`);
  }

  return String(current);
}

function formatMessage(message: string, params?: TranslationParams) {
  if (!params) {
    return message;
  }

  return message.replace(/{{(.*?)}}/g, (_, placeholder: string) => {
    const value = params[placeholder.trim()];

    if (value === undefined) {
      return '';
    }

    return String(value);
  });
}

export function createTranslator(dictionary: Dictionary, namespace?: string) {
  const dictionaryTree = dictionary as DictionaryTree;

  return (key: string, params?: TranslationParams) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    const message = resolveValue(dictionaryTree, fullKey);
    return formatMessage(message, params);
  };
}
