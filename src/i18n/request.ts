import { getRequestConfig } from 'next-intl/server';

import { getRequestLocale, getRequestMessages } from '@/lib/i18n/server';

export default getRequestConfig(async () => {
  const locale = await getRequestLocale();

  return {
    locale,
    messages: await getRequestMessages(locale),
  };
});
