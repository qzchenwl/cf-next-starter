import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await import(`./messages/${locale}.json`).then((module) => module.default);

  return {
    messages,
  };
});
