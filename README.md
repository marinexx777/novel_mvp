# Lumen Reads

Static bilingual webnovel MVP for English and French readers. The project is a
Next.js static export and is intended for Cloudflare Pages.

## Scope

This MVP intentionally does not include:

- Database
- CMS
- User accounts
- Payment system
- Real ad network integration

Content is stored as Markdown and JSON files under `content/`. Reader state,
library entries, anonymous analytics ID, and reward unlock state are stored in
`localStorage`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the static site:

```bash
npm run build
```

The build runs:

```bash
npm run prepare-static
```

This generates:

- `public/search-index-en.json`
- `public/search-index-fr.json`
- `public/sitemap.xml`
- `public/robots.txt`

The final static output is written to `out/`.

## Environment Variables

Create `.env.local` for local development or set these in Cloudflare Pages.

```bash
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
NEXT_PUBLIC_REWARDED_AD_SLOT=
```

`NEXT_PUBLIC_SITE_URL` is used for canonical URLs, sitemap URLs, and structured
data URLs.

GA4, PostHog, and ad environment variables are optional. If they are empty, the
site must still build and run. Rewarded ads use a mock flow until real ad IDs
and approval are available.

## Cloudflare Pages

Use these Cloudflare Pages settings:

- Build command: `npm run build`
- Build output directory: `out`
- Environment variables: set the values listed above as needed

After deployment, replace `NEXT_PUBLIC_SITE_URL` with the production domain and
rebuild so canonical URLs, sitemap, and structured data use the correct host.

## Content Structure

Each novel is stored in:

```text
content/en/<novel-slug>/
content/fr/<novel-slug>/
```

Each novel directory contains:

```text
metadata.json
chapter-001.md
chapter-002.md
...
```

English routes use `/en/novel/...`. French routes use `/fr/roman/...`.

## Import TXT Content

Use the import script to convert a plain TXT manuscript into the content folder:

```bash
npm run import-novel -- ./imports/story.txt --lang=en
npm run import-novel -- ./imports/histoire.txt --lang=fr
```

The script expects clear chapter headings:

```text
Chapter 1
Chapter 2
```

or:

```text
Chapitre 1
Chapitre 2
```

After import:

1. Review `metadata.json`.
2. Add genres, tags, author, description, and synopsis.
3. Confirm chapter files are split correctly.
4. Run `npm run build`.

The importer does not create a CMS and does not publish content automatically.
