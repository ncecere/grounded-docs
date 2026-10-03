export const appName = 'Grounded docs';
export const docsRoute = '/docs';
export const siteUrl = 'https://docs.grounded.bitop.dev';

/** The docs' own repository: "Edit on GitHub" links point here. */
export const gitConfig = {
  user: 'ncecere',
  repo: 'grounded-docs',
  branch: 'main',
};

/** The product's repository. */
export const productRepo = 'https://github.com/ncecere/grounded';

/** The Grounded release these docs describe. */
export const groundedVersion = 'v0.4.1';

export const docsRepoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export function editUrl(path: string): string {
  return `${docsRepoUrl}/blob/${gitConfig.branch}/${path}`;
}
