# rabiussani.me

Personal site for Md. Rabius Sani — AI & software engineer.

Built with Next.js (App Router, TypeScript) and exported as a static site, so it
keeps serving from GitHub Pages on the existing custom domain.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```

`npm run build` writes a fully static site to `out/`. There is no server at
runtime — `next start` will not serve it. To preview the built output:

```bash
npx serve out
```

## Layout

```
app/                 routes, global tokens, metadata
components/          Nav, Hero, Section, ProjectRecord, Topology, Contact
components/HeroGraph.tsx   the three.js service topology in the hero
content/profile.ts   every piece of site copy and data, in one file
public/              images, CNAME, manifest, robots, sitemap, .nojekyll
```

**To change any content, edit `content/profile.ts`.** Projects, roles, papers,
awards and skills all live there; nothing is hardcoded in the components.

Each featured project carries a `topology` — a small node graph drawn as its
architecture signature. Coordinates run 0–100 with the `viewBox` framed to the
content, and `above: true` moves a label above its node where an edge would
otherwise pass under it.

## The hero

`components/HeroGraph.tsx` builds a layered service graph from a fixed seed, so
it draws the same shape every load. On load the nodes fade in by layer, the
edges draw from source to target, then data pulses start travelling them.

It stops rendering when the hero scrolls out of view or the tab is hidden, holds
a single static frame under `prefers-reduced-motion`, and if WebGL is
unavailable the hero falls back to the plain text block.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `out/` to GitHub Pages. In the repository settings, **Pages → Source**
must be set to **GitHub Actions**.

`public/CNAME` holds the custom domain and `public/.nojekyll` keeps Pages from
stripping the `_next/` directory.
