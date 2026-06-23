// https://nuxt.com/docs/api/configuration/nuxt-config
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import tailwindcss from '@tailwindcss/vite'
import presentationWatcher from './plugins/presentation-watcher.js'
import themeWatcher from './plugins/theme-watcher.js'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-27',

  srcDir: 'src/',

  // Frozen bundles build against a reduced public/ (build-reduced-public.js) instead
  // of the whole repo public/ (~11 Mo of home photos + all themes' backgrounds).
  ...(process.env.BUNDLE_PUBLIC_DIR
    ? { dir: { public: process.env.BUNDLE_PUBLIC_DIR } }
    : {}),

  features: {
    // Reveal-only frozen deck (DDR-017 §2.a-ter), bundle mode only. Together these
    // produce hydration-free HTML with all CSS inlined, so the deck needs no JS:
    //   noScripts → no entry script / _payload / preload hints (slides are in the
    //     SSR markup since we dropped <ClientOnly>, nothing to hydrate).
    //   inlineStyles: () => true → inline ALL CSS, not just `.vue` (the default
    //     predicate). Composable-level CSS (e.g. reveal.css) would otherwise stay a
    //     <link> into the deleted _nuxt/ dir and 404.
    noScripts: !!process.env.BUNDLE_ONLY_SLUG,
    inlineStyles: process.env.BUNDLE_ONLY_SLUG ? () => true : undefined,
  },

  modules: ['@nuxtjs/mdc', 'nuxt-auth-utils', '@nuxt/icon'],

  css: ['~/assets/css/tailwind.css'],

  icon: {
    // Remix Icons are installed locally via @iconify-json/ri
    // Usage: <Icon name="ri:home-line" /> or in markdown: :i{name="ri:home-line"}
    mode: 'svg', // SVG mode for better SSR support
    serverBundle: {
      collections: ['ri'],
    },
  },

  mdc: {
    headings: {
      anchorLinks: false,
    },
  },

  vite: {
    plugins: [tailwindcss(), themeWatcher(), presentationWatcher()],
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      title: 'Nuxt Slides',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  runtimeConfig: {
    // Self-hosted CodiMD instance URL (server-only for fetching)
    codimdUrl: process.env.NUXT_CODIMD_URL || '',
    // HackMD.io API token for Bearer auth (server-only, never exposed to client)
    hackmdApiToken: process.env.NUXT_HACKMD_API_TOKEN || '',
    // Single, shared TTL (ms) for content sources + registry (audit §5.7 / P1 #6).
    sourceCacheTtlMs: process.env.NUXT_SOURCE_CACHE_TTL_MS || '',
    public: {
      // Exposed to client for building "Edit" links
      codimdUrl: process.env.NUXT_CODIMD_URL || '',
    },
  },

  // Hybrid rendering: SSG for public slides, SSR for protected routes.
  // In bundle mode (BUNDLE_ONLY_SLUG, DDR-017 §2.a-ter) we ONLY want the deck's
  // own slug + its API — not the app shell (/, /login) nor the global API index,
  // which would otherwise be prerendered into the bundle as dead pages.
  routeRules: process.env.BUNDLE_ONLY_SLUG
    ? {
        '/slides/**': { prerender: true },
        '/api/presentations/**': { prerender: true },
      }
    : {
        // Index and login are prerendered
        '/': { prerender: true },
        '/login': { prerender: true },

        // Public slides are prerendered (SSG) - more specific first
        '/slides/public/**': { prerender: true },

        // Protected/dynamic slides require SSR - after specific rules
        '/slides/**': { ssr: true },
        '/unlock/**': { ssr: true },
        '/admin/**': { ssr: true },

        // API: public presentations can be prerendered
        '/api/presentations': { prerender: true },

        // API: protected presentations require SSR (cookies, auth)
        '/api/presentations/**': { ssr: true },
      },

  nitro: {
    // Bundle the `presentations/` folder (stubs + registry.yml) as a server asset
    // so it is reachable at runtime through `useStorage('assets:presentations')` on
    // every target — including serverless (Vercel), where a cwd-relative path does
    // NOT resolve. This is what makes the live `/p/<alias>` route + the registry
    // work in production (DDR-018).
    serverAssets: [
      { baseName: 'presentations', dir: join(process.cwd(), 'presentations') },
    ],

    // Frozen-presentation hosting (DDR-018) lives OUTSIDE public/, so `nuxt
    // generate` never aspirates already-frozen bundles (or their mirrored assets)
    // into the next build. Nitro serves these extra dirs as static at the same
    // origin: `.frozen/` → /frozen/<alias>/ (the bundles), `.frozen-mirror/` → /
    // (the future-proof origin-root asset safety net; bundles are self-contained
    // and don't need it, but a non-rebased consumer would). maxAge 0 keeps them
    // re-servable without a cache-bust between freezes.
    publicAssets: [
      { dir: join(process.cwd(), '.frozen'), baseURL: '/frozen', maxAge: 0 },
      { dir: join(process.cwd(), '.frozen-mirror'), baseURL: '/', maxAge: 0 },
    ],
    prerender: {
      // Crawl links to discover routes
      crawlLinks: true,
      // Only prerender public presentations API
      routes: ['/api/presentations'],
    },
    hooks: {
      // In bundle mode, skip the SPA fallbacks (index/200/404) + the prerendered
      // API json — dead weight in a single-deck static bundle.
      'prerender:generate': function (route) {
        if (!process.env.BUNDLE_ONLY_SLUG)
          return
        // Skip SPA fallbacks (the deck is a single static Reveal page) and the
        // prerendered API json (the deck is static — it no longer fetches it).
        if (['/index.html', '/200.html', '/404.html', '/'].includes(route.route)
          || route.route?.startsWith('/api/')) {
          route.skip = true
        }
      },
    },
  },

  // Hook to discover and prerender only PUBLIC presentation routes
  hooks: {
    'nitro:config': async function (nitroConfig) {
      const publicDir = join(process.cwd(), 'presentations', 'public')

      // BUNDLE_ONLY_SLUG: restrict prerender to a single slug (standalone bundle mode)
      const onlySlug = process.env.BUNDLE_ONLY_SLUG
      if (onlySlug) {
        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.crawlLinks = false
        // ONLY the deck's slug + its API. No '/' (the app home is dead weight in a
        // single-deck bundle); the fallback files are skipped via prerender:generate.
        nitroConfig.prerender.routes = [
          `/slides/${onlySlug}`,
          `/api/presentations/${onlySlug}`,
        ]
        return
      }

      try {
        const files = await readdir(publicDir)
        const slugs = files
          .filter((file: string) => file.endsWith('.md'))
          .map((file: string) => file.replace('.md', ''))

        const publicRoutes = slugs.flatMap((slug: string) => [
          `/slides/${slug}`,
          `/api/presentations/${slug}`,
        ])

        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
        nitroConfig.prerender.routes.push(...publicRoutes)
      }
      catch (error) {
        console.warn('Could not discover public presentation routes:', error)
      }
    },
    'nitro:build:public-assets': async function (nitro) {
      const { cp } = await import('node:fs/promises')
      const srcDir = join(process.cwd(), 'presentations')
      const destDir = join(nitro.options.output.serverDir, 'presentations')

      try {
        await cp(srcDir, destDir, { recursive: true })
        console.log('✅ Copied presentations folder to build output')
      }
      catch (error) {
        console.error('❌ Failed to copy presentations:', error.message)
      }
    },
  },
})
