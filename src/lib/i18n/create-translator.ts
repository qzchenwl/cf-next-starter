import { getDictionary } from '@/lib/i18n/get-dictionary';
import type { Locale } from '@/lib/i18n/config';
import type { Messages } from '@/lib/i18n/messages';

export type TranslationValues = Record<string, string | number>;

export type Translator = (key: string, values?: TranslationValues) => string;

export function createTranslator(messages: Messages, namespace?: string): Translator {
  return (key, values) => {
    const fullKey = namespace ? `${namespace}.${key}` : key;
    return translateMessage(messages, fullKey, values);
  };
}

export async function getTranslator(locale: Locale, namespace?: string): Promise<Translator> {
  const dictionary = await getDictionary(locale);
  return createTranslator(dictionary, namespace);
}

function translateMessage(messages: Messages, key: string, values?: TranslationValues): string {
  const segments = key.split('.');
  let current: unknown = messages;

  for (const segment of segments) {
    if (typeof current !== 'object' || current === null || !(segment in current)) {
      return key;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  if (typeof current !== 'string') {
    return key;
  }

  if (!values) {
    return current;
  }

  return current.replace(/\{(\w+)\}/g, (match, token) => {
    const replacement = values[token];
    return replacement === undefined ? match : String(replacement);
  });
}
