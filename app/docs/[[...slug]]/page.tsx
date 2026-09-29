import { source } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/components/mdx';
import { OpenAPIPage } from '@/components/api-page';
import { ApiA11y } from '@/components/api-a11y';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { editUrl } from '@/lib/shared';
import { pruneDocument } from '@/lib/openapi';

export default async function Page(props: PageProps<'/docs/[[...slug]]'>) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  if (page.type === 'openapi') {
    const apiProps = page.data.getOpenAPIPageProps();
    const pruned = {
      ...apiProps,
      payload: {
        ...apiProps.payload,
        bundled: pruneDocument(apiProps.payload.bundled, apiProps.operations),
      },
    };
    return (
      <DocsPage full>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsBody>
          <OpenAPIPage {...pruned} />
          <ApiA11y />
        </DocsBody>
        <div className="mt-8 border-t border-fd-border pt-4">
          <EditOnGitHub href={editUrl('openapi/grounded.yaml')}>
            Generated from openapi/grounded.yaml
          </EditOnGitHub>
        </div>
      </DocsPage>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
      <div className="mt-8 border-t border-fd-border pt-4">
        <EditOnGitHub href={editUrl(`content/docs/${page.path}`)} />
      </div>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<'/docs/[[...slug]]'>): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
