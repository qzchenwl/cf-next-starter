'use client';

import { createContext, useContext, useMemo } from 'react';

import type { Locale } from '@/lib/i18n/config';
import type { Messages } from '@/lib/i18n/messages';
import { createTranslator, type Translator, type TranslationValues } from '@/lib/i18n/create-translator';

type TranslationContextValue = {
  locale: Locale;
  messages: Messages;
  translator: Translator;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationsProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  const translator = useMemo(() => createTranslator(messages), [messages]);

  const value = useMemo<TranslationContextValue>(
    () => ({
      locale,
      messages,
      translator,
    }),
    [locale, messages, translator],
  );

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslations(namespace?: string) {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }

  return (key: string, values?: TranslationValues) => {
    const baseKey = namespace ? `${namespace}.${key}` : key;
    return context.translator(baseKey, values);
  };
}

export function useLocale() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useLocale must be used within a TranslationsProvider');
  }

  return context.locale;
}
