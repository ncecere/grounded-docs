import { loader, type LoaderPlugin } from 'fumadocs-core/source';
import type * as PageTree from 'fumadocs-core/page-tree';
import { defineDocs } from 'fumadocs-mdx/macro';
import { metaSchema, pageSchema } from 'fumadocs-core/source/schema';
import { docsRoute } from './shared';
import { openapi, primaryTag, tagLabels } from './openapi';

const docs = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: pageSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

/** Sidebar names for API operations: the summary, shortened, and a compact method label. */
function shorten(text: string, max = 60): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), 40)).replace(/[\s,;:(]+$/, '')}\u2026`;
}

const apiSidebarNames: LoaderPlugin = {
  name: 'grounded:api-sidebar-names',
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;
      const file = this.storage.read(filePath);
      if (!file || file.format !== 'page') return node;
      const meta = (file.data as { _openapi?: { method?: string } })._openapi;
      if (!meta?.method || typeof node.name !== 'string') return node;
      node.name = (
        <>
          {shorten(node.name)}{' '}
          <span className="api-method" data-method={meta.method.toLowerCase()}>
            {meta.method}
          </span>
        </>
      );
      return node;
    },
  },
};

// The API reference is generated from openapi/grounded.yaml at build time:
// one page per operation, in a folder for the operation's first tag, under
// /docs/api/reference.
export const source = loader(
  {
    docs: docs.toFumadocsSource(),
    openapi: await openapi.staticSource({
      baseDir: 'api/reference',
      per: 'operation',
      groupBy: (entry) => (entry.type === 'operation' ? primaryTag(entry.item.method, entry.item.path) : 'webhooks'),
      meta: true,
    }),
  },
  {
    baseUrl: docsRoute,
    plugins: [apiSidebarNames],
  },
);

/**
 * The sidebar's tree, lighter: descriptions aren't shown in the sidebar, and
 * with a page per API operation they would make every page's payload large.
 * API reference folders get readable names.
 */
export function sidebarTree(): PageTree.Root {
  const strip = <N extends PageTree.Node>(node: N, parentIsReference: boolean): N => {
    if (node.type === 'page') {
      const { description: _description, ...rest } = node;
      return rest as N;
    }
    if (node.type === 'folder') {
      const slug = node.$id?.split('/').pop() ?? '';
      const isReference = node.$id === 'api/reference';
      const name = parentIsReference && tagLabels[slug] ? tagLabels[slug] : node.name;
      return {
        ...node,
        name,
        description: undefined,
        index: node.index ? strip(node.index, false) : undefined,
        children: node.children.map((c) => strip(c, isReference)),
      } as N;
    }
    return node;
  };
  const tree = source.getPageTree();
  return { ...tree, children: tree.children.map((c) => strip(c, false)) };
}
