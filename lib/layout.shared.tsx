import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { NavTitle } from '@/components/logo';
import { productRepo } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <NavTitle />,
      url: '/',
    },
    // The GitHub icon links to the product; each page links to its own source.
    githubUrl: productRepo,
    links: [
      {
        text: 'Documentation',
        url: '/docs/getting-started',
        active: 'nested-url',
      },
      {
        text: 'API',
        url: '/docs/api',
        active: 'nested-url',
      },
      {
        text: 'Releases',
        url: '/docs/releases',
        active: 'nested-url',
      },
    ],
  };
}
