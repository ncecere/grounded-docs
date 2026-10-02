import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { createOpenAPI } from 'fumadocs-openapi/server';

// Grounded's OpenAPI description, copied from the Grounded repository at the
// release these docs describe. Refresh it with `npm run sync:openapi`.
const schemaPath = './openapi/grounded.yaml';

export const openapi = createOpenAPI({
  input: [schemaPath],
});

type Json = Record<string, unknown>;
const methods = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

const spec = parse(readFileSync(join(process.cwd(), schemaPath), 'utf8')) as {
  paths: Record<string, Record<string, { tags?: string[] }>>;
};

/** The first tag of each operation: its page appears once, in that tag's folder. */
export function primaryTag(method: string, path: string): string {
  return spec.paths[path]?.[method]?.tags?.[0] ?? 'other';
}

/** Sidebar labels for the spec's tags. */
export const tagLabels: Record<string, string> = {
  operations: 'Operations',
  auth: 'Sign-in',
  me: 'Me',
  notifications: 'Notifications',
  teams: 'Teams',
  classifications: 'Classifications',
  admin: 'Admin',
  sources: 'Data sources',
  web: 'Web sources and crawling',
  kbs: 'Knowledge bases',
  apikeys: 'API keys',
  limits: 'Limits',
  costs: 'Costs and budgets',
  agents: 'Agents',
  chat: 'Chat and conversations',
  search: 'Search',
  evaluations: 'Evaluations',
  gaps: 'Gap report',
  openai: 'OpenAI-compatible',
  oauth: 'OAuth sign-in (MCP)',
  breakglass: 'Break-glass',
  public: 'Public agents and widget',
};

/**
 * Each reference page receives the OpenAPI document as props. Grounded's
 * document is large, so keep only the page's own operations and the
 * components they reach; otherwise every page would carry the whole spec.
 */
export function pruneDocument<T>(doc: T, operations: { path: string; method: string }[] = []): T {
  const d = doc as Json;
  const paths = (d.paths ?? {}) as Record<string, Json>;
  const keptPaths: Record<string, Json> = {};

  for (const op of operations) {
    const item = paths[op.path];
    if (!item) continue;
    const kept: Json = keptPaths[op.path] ?? {};
    for (const [k, v] of Object.entries(item)) {
      if (!methods.includes(k) || k === op.method) kept[k] = v;
    }
    keptPaths[op.path] = kept;
  }

  const components = (d.components ?? {}) as Record<string, Record<string, unknown>>;
  const keptComponents: Record<string, Record<string, unknown>> = {};
  const seen = new Set<string>();
  const queue: unknown[] = [keptPaths];

  while (queue.length > 0) {
    const node = queue.pop();
    if (Array.isArray(node)) {
      for (const n of node) queue.push(n);
      continue;
    }
    if (!node || typeof node !== 'object') continue;
    for (const [k, v] of Object.entries(node as Json)) {
      if (k === '$ref' && typeof v === 'string' && v.startsWith('#/components/')) {
        if (seen.has(v)) continue;
        seen.add(v);
        const [, , section, name] = v.split('/');
        const target = components[section]?.[decodeURIComponent(name)];
        if (target !== undefined) {
          keptComponents[section] ??= {};
          keptComponents[section][name] = target;
          queue.push(target);
        }
      } else if (v && typeof v === 'object') {
        queue.push(v);
      }
    }
  }

  // Security schemes are small and referenced by name, not $ref: keep them all.
  if (components.securitySchemes) keptComponents.securitySchemes = components.securitySchemes;

  // Grounded's spec names no server (every install has its own origin), so
  // examples use a placeholder origin.
  const servers = Array.isArray(d.servers) && d.servers.length > 0 ? d.servers : [{ url: 'https://grounded.example.org' }];

  return { ...d, servers, paths: keptPaths, components: keptComponents } as T;
}
