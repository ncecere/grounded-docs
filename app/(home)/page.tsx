import Link from 'next/link';
import { Card, Cards } from 'fumadocs-ui/components/card';
import {
  BookOpen,
  Code,
  MessagesSquare,
  Server,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { GroundedMark } from '@/components/logo';
import { groundedVersion, productRepo } from '@/lib/shared';

const sections = [
  {
    title: 'Getting started',
    href: '/docs/getting-started',
    icon: <BookOpen />,
    description: 'What Grounded is, the ideas it is built on, a local demo and a quick tour.',
  },
  {
    title: 'Using Grounded',
    href: '/docs/using',
    icon: <MessagesSquare />,
    description:
      'Chatting with agents, and building data sources, knowledge bases, agents and evaluations for your team.',
  },
  {
    title: 'Administration',
    href: '/docs/administration',
    icon: <ShieldCheck />,
    description:
      'The admin portal: people and teams, models, classifications, limits, costs, retention and break-glass.',
  },
  {
    title: 'Self-hosting',
    href: '/docs/self-hosting',
    icon: <Server />,
    description:
      'Install on Kubernetes, configure it, connect sign-in and models, monitor, back up and upgrade.',
  },
  {
    title: 'API',
    href: '/docs/api',
    icon: <Code />,
    description:
      'API keys, the OpenAI-compatible chat endpoint with citations and claims, and the full reference.',
  },
  {
    title: 'Releases',
    href: '/docs/releases',
    icon: <Tag />,
    description: `What changed in each release, how to upgrade, and known limitations. Latest: ${groundedVersion}.`,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 md:py-16">
      <div className="flex flex-col gap-4">
        <p className="inline-flex items-center gap-2 text-sm font-medium text-fd-muted-foreground">
          <GroundedMark />
          Grounded {groundedVersion} documentation
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          Answers from your own sources, with citations.
        </h1>
        <p className="max-w-2xl text-lg text-fd-muted-foreground">
          Grounded is an open-source, multi-tenant RAG and agents platform. Teams turn files and
          websites into knowledge bases and publish agents that answer only from them. These docs
          are for the people who use it, the teams who build with it, and the operators who run
          it.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/docs/getting-started"
            className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-medium text-brand-primary-contrast shadow-brand-1 hover:bg-brand-primary-hover"
          >
            Get started
          </Link>
          <Link
            href="/docs/getting-started/try-it-locally"
            className="rounded-lg border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent"
          >
            Try it locally
          </Link>
          <a
            href={productRepo}
            className="rounded-lg border border-fd-border bg-fd-card px-4 py-2 text-sm font-medium hover:bg-fd-accent"
          >
            Source on GitHub
          </a>
        </div>
      </div>

      <h2 className="sr-only">Sections</h2>
      <Cards className="mt-12">
        {sections.map((s) => (
          <Card key={s.href} title={s.title} href={s.href} icon={s.icon}>
            {s.description}
          </Card>
        ))}
      </Cards>

      <p className="mt-12 text-sm text-fd-muted-foreground">
        Grounded is pre-1.0 and has one maintainer. It is MIT licensed. These docs describe{' '}
        {groundedVersion}; the engineering record (design, decisions and runbooks) stays in the{' '}
        <a className="underline" href={`${productRepo}/tree/main/docs`}>
          repository&apos;s docs folder
        </a>
        .
      </p>
    </div>
  );
}
