# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An Astro 5.x personal blog ("algorhythm") based on astro-theme-thought-lite. Uses Svelte 5 for interactive components, Tailwind CSS 4 for styling, and pnpm as package manager. Deployed to GitHub Pages via GitHub Actions.

## Commands

```bash
pnpm dev          # Start dev server (localhost:4321)
pnpm build        # Production build
pnpm preview      # Preview built site
pnpm check        # Astro type checking
pnpm lint         # Biome linter
pnpm format       # Biome formatter (auto-fix)
pnpm new          # Create new content file via scripts/new.ts
```

No test framework is configured. CI runs `biome ci` on PRs; pre-commit hooks run `biome check --write` via lint-staged.

## Architecture

### Content Collections (src/content.config.ts)

Four collections with distinct purposes:
- **note** — Long-form articles. Supports series, tags, TOC, sensitivity flags, pinning (`top`), and drafts. Files prefixed with `_` are excluded.
- **jotting** — Short-form/micro-blog entries. Simpler metadata.
- **preface** — Homepage intro snippets. Filename convention: `YYYY-MM-DD-HH-mm-ss.md`.
- **information** — Static pages (about, policy, linkroll). Accepts `.md`, `.mdx`, and `.yaml`.

Content lives in `src/content/{note,jotting,preface,information}/`.

### Page Routing (src/pages/[...locale]/)

Uses `[...locale]` dynamic segments for i18n. Currently configured for `zh-cn` only (monolocale). Routes: `index`, `about`, `policy`, `preface`, `note/[...id]`, `jotting/[...id]`, `feed.xml`, `feed.xsl`.

### Layouts

- `App.astro` — Root HTML shell (head, meta, OG tags)
- `Base.astro` — Header/footer wrapper, Swup transitions, theme, time localization

### Components (src/components/)

Mix of Astro (static) and Svelte 5 (interactive). Key ones: `Note.svelte` and `Jotting.svelte` handle client-side filtering/pagination; `ThemeSwitcher.svelte` for dark/light toggle; `Sensitive.svelte` for content blur/reveal; `Heatmap.astro` for activity visualization.

### i18n (src/i18n/)

Translation files are YAML (`index.yaml`, `script.yaml`, `linkroll.yaml`) per locale. The `i18nit` factory function supports dot-notation keys, `{{param}}` interpolation, and pluralization via `Intl.PluralRules`. Use `$i18n` import alias.

### Markdown Pipeline (astro.config.ts)

Extensive remark/rehype plugin chain. Custom plugins in `src/utils/remark/`: spoiler, attr, abbr, ruby, github-alert, table-wrapper, reading-time, figure. Code highlighting via Shiki with light/dark themes and a custom copy-button transformer (`src/utils/code-copy.ts`).

### Path Aliases (tsconfig.json)

`$config`, `$public/*`, `$assets/*`, `$icons/*`, `$graph/*`, `$utils/*`, `$components/*`, `$i18n`, `$layouts/*`, `$styles/*` — use these instead of relative paths.

## Site Configuration

Blog settings (title, author, pagination, i18n locale, heatmap, feed) are in `site.config.ts`. Use the `$config` alias to import.

## Conventions

- Linter/formatter: **Biome** (primary), Prettier (secondary for Astro/Svelte). Biome config in `biome.json`, Prettier in `.prettierrc`.
- Tabs for indentation, double quotes in JS/TS.
- Husky pre-commit hook auto-formats staged files.
- Draft/private content: prefix filename with `_` to exclude from collections.
