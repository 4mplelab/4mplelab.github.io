// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
import lismTheme from './src/theme/index.mjs'
import stepHeadings from './src/theme/rehype-step-headings.mjs'
import starlightImageZoom from 'starlight-image-zoom'

// https://astro.build/config
export default defineConfig({
	site: 'https://4mplelab.github.io',
	base: '/',
	integrations: [
		starlight({
			plugins: [lismTheme(), starlightImageZoom()],
			title: 'LisM',
            favicon: '/LisM/favicon.svg?v=2',
            routeMiddleware: './src/routeData.ts',
			description: '自作キーボードLisMのドキュメントです。ビルドガイド・ファームウェア設定方法・HowToなどを掲載しています。',
			logo: { src: '/src/assets/logo.svg', alt: 'LisM Logo', replacesTitle: true, },
			defaultLocale: 'root',
			lastUpdated: true,
			locales: {
				root: {
					label: '日本語',
					lang: 'ja',
				},
			},
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/4mplelab' },
				{ icon: 'x.com', label: 'x.com', href: 'https://x.com/4mple_' },
			],
			sidebar: [
						{ label: 'ビルドガイドTop', slug: 'LisM/build_guides' },
						{ label: '本体', slug: 'LisM/build_guides/main' },
						{
							label: 'モジュール',
							items: [
								{ label: 'トラックボールセンサー', slug: 'LisM/build_guides/modules/trackball_sensor' },
								{
									label: '水平ロータリーエンコーダー',
									slug: 'LisM/build_guides/modules/horizontal_rotary_encoder',
								},
								{
									label: '垂直ロータリーエンコーダー',
									slug: 'LisM/build_guides/modules/vertical_rotary_encoder',
								},
								{ label: 'キースイッチ', slug: 'LisM/build_guides/modules/key' },
								{ label: '4wayスティック', slug: 'LisM/build_guides/modules/4way_stick' },
							],
						},
						{
							label: 'ユニット',
							items: [
								{
									label: 'トラックボール (10-14mm)',
									slug: 'LisM/build_guides/units/trackball_10-14mm',
								},
								{ label: 'トラックボール (19mm)', slug: 'LisM/build_guides/units/trackball_19mm' },
								{ label: 'トラックボール (20mm)', slug: 'LisM/build_guides/units/trackball_20mm' },
							],
						},
			],
			customCss: [
				'./src/styles/custom.css',
			],
			components: {
				Footer: './src/components/Footer.astro',
                Pagination: './src/components/GuidePagination.astro',
                PageFrame: './src/components/GuidePageFrame.astro',
                Sidebar: './src/components/GuideSidebar.astro',
                Header: './src/components/GuideHeader.astro',
                MobileMenuToggle: './src/components/GuideMenuControls.astro',
                PageSidebar: './src/components/GuidePageSidebar.astro',
			},
			head: [
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://4mplelab.github.io/LisM/img/ogp_lism.png' } },
                { tag: 'meta', attrs: { property: 'og:image:alt', content: 'モジュール式分割キーボード LisM' } },
				{
					tag: 'script',
					attrs: { async: true, src: 'https://www.googletagmanager.com/gtag/js?id=G-C13DXFJ6RG' },
				},
				{
					tag: 'script',
					attrs: { async: true, src: 'https://base-shop-4mple-lab.pages.dev/js/ogp-card.js' },
				},
				{
					tag: 'script',
					attrs: { async: true, src: 'https://base-shop-4mple-lab.pages.dev/js/ogp-card-renderer.js' },
				},
				{
					tag: 'link',
					attrs: { rel: 'stylesheet', href: 'https://base-shop-4mple-lab.pages.dev/styles/ogp-card.css' },
				},
				{
					tag: 'script',
					content: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', 'G-C13DXFJ6RG');
					`,
				},
			],
		}),
		mdx(),
	],
  markdown: {
    rehypePlugins: [
      stepHeadings,
      [
        rehypeExternalLinks,
        {
          target: '_blank', // 外部リンクを新しいタブで開く
          rel: ['noopener', 'noreferrer'], // セキュリティ対策
          content: { type: 'text', value: ' 🔗' }, // 外部リンクアイコン（オプション）
        },
      ],
    ],
  }
});
