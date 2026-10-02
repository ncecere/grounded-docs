# Grounded docs

The user and operator documentation for [Grounded](https://github.com/ncecere/grounded), the open-source, multi-tenant RAG and agents platform. It's published at <https://docs.grounded.bitop.dev>.

These pages are for the people who use Grounded, the teams who build with it, and the operators who run it. The Grounded repository's own `docs/` folder stays the engineering record (design, decisions and the original runbooks). The docs describe **Grounded v0.4.0**.

A static site: [Fumadocs](https://fumadocs.dev) on Next.js with `output: "export"`, TypeScript and Tailwind CSS v4, served by nginx in a container. Search is Fumadocs' built-in static index, searched in the browser. No tracking, no cookies, no external fonts or CDNs: Inter is self-hosted.

## Local development

You need Node 22 and npm.

```sh
npm ci
npm run dev          # http://localhost:3000
```

| Command | Does |
|---|---|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | The static export, in `out/`. |
| `npm run check:links` | Checks every internal link and anchor in `out/` (run after a build). |
| `npm run typecheck` | TypeScript. |
| `npm start` | Serves `out/` locally. |
| `npm run sync:openapi` | Refreshes `openapi/grounded.yaml` from a Grounded checkout (`../golang/grounded`, or `$GROUNDED_REPO`), or from GitHub at a tag: `npm run sync:openapi -- v0.4.0`. |
| `npm run screenshots` | Imports screenshots (below). |
| `npm run screenshots:check` | Lists screenshot slots that are still placeholders. |

## Layout

```text
app/brand.css                 Grounded's brand tokens for Tailwind v4, shared verbatim with the website
app/global.css                Tailwind, Fumadocs' CSS, and Fumadocs' variables mapped onto brand.css
app/(home)/page.tsx           the landing page
app/docs/[[...slug]]/page.tsx docs pages, and the generated API reference
app/api/search/route.ts       the static search index (exported as /api/search)
app/not-found.tsx             the 404 page
content/docs/                 the pages, in MDX, one folder per section (meta.json orders them)
openapi/grounded.yaml         Grounded's OpenAPI document; the API reference is generated from it
components/screenshot.tsx     named screenshot slots, with a marked placeholder until an image exists
lib/screenshot-slots.json     the slots and their alt text
lib/screenshots.json          imported screenshots and their sizes (written by the import script)
scripts/                      sync-openapi, import-screenshots, check-links
nginx/                        nginx.conf and the site's server block and security headers
Dockerfile                    builds the export, then serves it with nginx
```

## Writing

- Every claim must be true of the Grounded release the docs describe. Check it against the Grounded repository (the changelog, release notes, `docs/`, `.env.example`, `api/openapi.yaml`) before you write it.
- Plain, short sentences. Examples are generic (`example.org`, "Admissions"); no real organisation's names or data.
- Use Fumadocs' components where they help: `Callout`, `Steps`, `Tabs`, `Cards`, `Files`.
- Each page has an "Edit on GitHub" link to its file in this repository.

### Screenshots

Screenshots come only from the public demo instance ("Example University"), never from a real install. Each image has a named slot in `lib/screenshot-slots.json` (its alt text, the file names it may have, and optionally a `hold` reason that keeps a known-bad capture out) and is placed with `<Screenshot slot="…" />`. Until an image is imported, the slot shows a clearly marked placeholder. When you replace an image, check that its slot's alt text still describes it.

```sh
SCREENSHOTS_DIR=../grounded-assets/screenshots npm run screenshots
```

converts each available PNG to WebP (at most 1600 px wide) in `public/images/`, and records its width and height in `lib/screenshots.json`.

## Container

```sh
docker build -t grounded-docs .
docker run --rm -p 8080:8080 --read-only --tmpfs /tmp:uid=101,gid=101 grounded-docs
```

nginx (Alpine, pinned by digest) runs as user 101 on port 8080, keeps its pid and temp files under `/tmp` (so the root filesystem can be read-only; mount an `emptyDir` at `/tmp` in Kubernetes), answers `/healthz`, sends security headers and a Content Security Policy, gzips text, and caches hashed assets for a year.

## Deploy

Pushes to `main` run `.github/workflows/publish.yaml`: it type-checks, builds and link-checks the site, then builds and pushes a multi-arch image (linux/amd64, linux/arm64):

- `ghcr.io/ncecere/grounded-docs:<full commit sha>`
- `ghcr.io/ncecere/grounded-docs:latest`

Pull requests run the checks only. Actions are pinned by commit SHA, and Dependabot opens grouped weekly updates for npm, Actions and the Docker base images.

## Licence

- **Code** (the site's source, scripts and configuration): [MIT](LICENSE).
- **Documentation text and images**: [Creative Commons Attribution 4.0 International](LICENSE-CONTENT) (CC BY 4.0).
- `openapi/grounded.yaml` is a copy of Grounded's API description, MIT like the rest of Grounded.
- Inter is under the SIL Open Font License 1.1.
