import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  CloudLightning,
  Database,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { D1StatusCard } from "./_components/d1-status-card";
import { KvStatusCard } from "./_components/kv-status-card";
import { R2StatusCard } from "./_components/r2-status-card";

const highlights = [
  {
    title: "Edge-first runtime",
    description: "Serve Next.js App Router routes with near-zero cold starts on Cloudflare Workers.",
    icon: CloudLightning,
  },
  {
    title: "Full data stack",
    description: "Ship with production-ready access to D1, R2, and KV from a single codebase.",
    icon: Database,
  },
  {
    title: "Opinionated DX",
    description: "Prewired linting, type-safety, and shadcn/ui primitives for fast iteration.",
    icon: Boxes,
  },
];

export default function Home() {
  return (
    <main className="container flex flex-col gap-16 py-16">
      <section className="flex flex-col gap-8 text-center sm:text-left">
        <div className="flex justify-center sm:justify-start">
          <Badge className="gap-2 px-4 py-1 text-sm" variant="secondary">
            Cloudflare Workers • Next.js 15
          </Badge>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Cloudflare + Next.js starter, upgraded with shadcn/ui
          </h1>
          <p className="mx-auto max-w-3xl text-base text-muted-foreground sm:text-lg">
            Deploy a modern, edge-native application with polished UI primitives, instant data checks,
            and a toolkit tuned for the Cloudflare stack. Start iterating in minutes with production-ready defaults.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-start">
          <Button asChild size="lg">
            <Link href="https://dash.cloudflare.com/sign-up" target="_blank" rel="noreferrer">
              Deploy to Cloudflare
              <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/" target="_blank" rel="noreferrer">
              Deployment guide
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((feature) => (
          <Card key={feature.title} className="h-full">
            <CardHeader className="flex-row items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Verify your Cloudflare bindings</h2>
          <p className="text-muted-foreground">
            Run the built-in health checks to confirm each service is wired up to your environment.
          </p>
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <D1StatusCard />
          <R2StatusCard />
          <KvStatusCard />
        </div>
      </section>
    </main>
  );
}
