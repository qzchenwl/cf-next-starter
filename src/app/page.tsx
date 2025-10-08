import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ArrowUpRight, BookOpenText, Cloud, Workflow } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { D1StatusCard } from '@/components/d1-status-card';
import { KvStatusCard } from '@/components/kv-status-card';
import { R2StatusCard } from '@/components/r2-status-card';
import { AuthStatusCard } from '@/components/auth-status-card';
import { SentryStatusCard } from '@/components/sentry-status-card';
import { LocaleStatusCard } from '@/components/locale-status-card';

const resourceLinks = [
  {
    key: 'workers',
    href: 'https://developers.cloudflare.com/workers/',
    icon: Cloud,
  },
  {
    key: 'openNext',
    href: 'https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/',
    icon: Workflow,
  },
  {
    key: 'nextDocs',
    href: 'https://nextjs.org/docs',
    icon: BookOpenText,
  },
];

export default async function Home() {
  const t = await getTranslations('Home');

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl"
      />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12 sm:px-10 lg:px-12">
        <header className="grid gap-10 md:grid-cols-[minmax(0,1fr)_320px] md:items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{t('heroTitle')}</h1>
              <p className="text-base text-muted-foreground sm:text-lg">{t('heroDescription')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://dash.cloudflare.com/?to=/:account/workers-and-pages/create/import-repository"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'lg' }), 'sm:w-auto')}
              >
                {t('primaryAction')}
              </Link>
              <Link
                href="https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'sm:w-auto')}
              >
                {t('secondaryAction')}
              </Link>
            </div>
          </div>

          <div className="relative hidden h-full w-full items-center justify-center md:flex">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-lg">
              <Image className="dark:invert" src="/next.svg" alt={t('heroImageAlt')} width={180} height={38} priority />
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resourceLinks.map(({ key, href, icon: Icon }) => (
            <Card
              key={key}
              className="relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-xl">{t(`resourceLinks.${key}.title`)}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {t(`resourceLinks.${key}.description`)}
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-end">
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 text-sm font-medium')}
                >
                  {t('resourceAction')}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <LocaleStatusCard />
          <D1StatusCard />
          <R2StatusCard />
          <KvStatusCard />
          <AuthStatusCard />
          <SentryStatusCard />
        </section>

        <footer className="border-t border-border pt-8">
          <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>{t('footer.note')}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://nextjs.org/learn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                {t('footer.learn')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://vercel.com/templates?framework=next.js"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                {t('footer.templates')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                {t('footer.visit')}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
