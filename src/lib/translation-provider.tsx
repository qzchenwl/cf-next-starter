'use client';

import { createContext, useContext, useMemo } from 'react';

import type { Dictionary } from '@/lib/i18n-types';
import type { Locale } from '@/lib/i18n-config';
import { createTranslator } from '@/lib/translator';

type TranslationContextValue = {
  locale: Locale;
  dictionary: Dictionary;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

type TranslationProviderProps = {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
};

export function TranslationProvider({ locale, dictionary, children }: TranslationProviderProps) {
  const value = useMemo(() => ({ locale, dictionary }), [locale, dictionary]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useLocale() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useLocale must be used within a TranslationProvider');
  }

  return context.locale;
}

export function useTranslations(namespace?: string) {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error('useTranslations must be used within a TranslationProvider');
  }

  return useMemo(() => createTranslator(context.dictionary, namespace), [context.dictionary, namespace]);
}

export type Translate = ReturnType<typeof useTranslations>;
