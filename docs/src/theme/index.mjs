import { fileURLToPath } from 'node:url';

const resolve = (path) => fileURLToPath(new URL(path, import.meta.url));

/** Local Starlight theme. Product-specific content and plugins stay in astro.config.mjs. */
export default function lismTheme() {
  return {
    name: 'lism-theme',
    hooks: {
      'config:setup'({ config, updateConfig }) {
        updateConfig({
          customCss: [resolve('./docs.css'), ...(config.customCss ?? [])],
          components: {
            ThemeProvider: resolve('./components/ThemeInit.astro'),
            ThemeSelect: resolve('./components/ThemeToggle.astro'),
            ...config.components,
          },
        });
      },
    },
  };
}
