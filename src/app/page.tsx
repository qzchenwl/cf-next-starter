import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, BookOpenText, Cloud, Workflow } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { D1StatusCard } from '@/components/d1-status-card';
import { KvStatusCard } from '@/components/kv-status-card';
import { R2StatusCard } from '@/components/r2-status-card';
import { AuthStatusCard } from '@/components/auth-status-card';
import { SentryStatusCard } from '@/components/sentry-status-card';

const resourceLinks = [
  {
    title: 'Cloudflare Workers',
    description: 'Deploy your Next.js application to the edge with the Workers platform.',
    href: 'https://developers.cloudflare.com/workers/',
    icon: Cloud,
  },
  {
    title: 'OpenNext for Cloudflare',
    description: 'Learn how OpenNext builds optimized Workers bundles for Next.js projects.',
    href: 'https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/',
    icon: Workflow,
  },
  {
    title: 'Next.js Documentation',
    description: 'Brush up on the App Router, server components, and streaming UI.',
    href: 'https://nextjs.org/docs',
    icon: BookOpenText,
  },
];

export default function Home() {
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
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Cloudflare + Next.js starter kit
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Inspect your Cloudflare bindings, validate connections, and ship with confidence using a refreshed
                dashboard powered by shadcn/ui components.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="https://dash.cloudflare.com/?to=/:account/workers-and-pages/create"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: 'lg' }), 'sm:w-auto')}
              >
                Deploy to Cloudflare Workers
              </Link>
              <Link
                href="https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'sm:w-auto')}
              >
                View Cloudflare guide
              </Link>
            </div>
          </div>

          <div className="relative hidden h-full w-full items-center justify-center md:flex">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-lg">
              <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resourceLinks.map(({ title, description, href, icon: Icon }) => (
            <Card
              key={title}
              className="relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <CardTitle className="text-xl">{title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex items-center justify-end">
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 text-sm font-medium')}
                >
                  Explore
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          <D1StatusCard />
          <R2StatusCard />
          <KvStatusCard />
          <AuthStatusCard />
          <SentryStatusCard />
        </section>

        <footer className="border-t border-border pt-8">
          <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Built with Next.js, OpenNext, and Cloudflare Workers — ready for your next deployment.</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://nextjs.org/learn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                Learn Next.js
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://vercel.com/templates?framework=next.js"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                Explore templates
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-foreground"
              >
                Visit nextjs.org
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
