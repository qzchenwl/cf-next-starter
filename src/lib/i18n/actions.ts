'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { defaultLocale, isSupportedLocale, localeCookieName, type Locale } from './config';

export async function setLocale(locale: Locale) {
  const nextLocale = isSupportedLocale(locale) ? locale : defaultLocale;
  const cookieStore = await cookies();

  cookieStore.set(localeCookieName, nextLocale, {
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });

  revalidatePath('/', 'layout');
}
