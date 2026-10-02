# LisM theme

Local Starlight plugin, deliberately independent of LisM page content.

- `index.mjs`: plugin entry; resolves its own assets and lets consumer overrides win.
- `fonts.css`, `tokens.css`, `icons.css`, `base.css`: shared foundation for standalone pages and docs.
- `docs.css`: Starlight-specific presentation; semantic alert colors use the shared palette.
- `components/`: shared theme initialization and cycling icon button. Uses `starlight-theme` storage.

The homepage imports `base.css` through its page stylesheet and uses the same theme components.
Site navigation, metadata, footer content, image zoom, OGP cards, and product badges remain outside this theme.
To package later, export the plugin and base stylesheet, declare Astro/Starlight as peer dependencies and Fontsource as dependencies. No site paths or product content belong in the package.

Verify after changes: light/dark/auto, saved preference across homepage/docs, mobile navigation, search, image zoom and Escape dismissal, case tabs, disclosure sections, and colored notices.

## Color palette

Open `palette.html` locally to compare light and dark swatches, CSS token names, values, and notice examples. It reads `tokens.css` directly and is not published as a site page.

Logo red (`--brand`) stays #9A0000. The accent is #9A0000 in both themes, with white text on filled badges. Semantic colors have separate light/dark values; notice backgrounds use 8% opacity.

`rehype-step-headings.mjs` is registered in Astro markdown.rehypePlugins. It highlights existing numeric heading prefixes at build time while preserving anchor IDs (trailing number punctuation is omitted in badges); Markdown sources need no presentation markup.
