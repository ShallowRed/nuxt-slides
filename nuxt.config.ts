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
    head: {
      title: 'Nuxt Slides',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },

  // Hybrid rendering: SSG for public slides, SSR for protected routes
  routeRules: {
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
    prerender: {
      // Crawl links to discover routes
      crawlLinks: true,
      // Only prerender public presentations API
      routes: ['/api/presentations'],
    },
  },

  // Hook to discover and prerender only PUBLIC presentation routes
  hooks: {
    'nitro:config': async function (nitroConfig) {
      // Only prerender public presentations (SSG)
      const publicDir = join(process.cwd(), 'presentations', 'public')
      try {
        const files = await readdir(publicDir)
        const slugs = files
          .filter((file: string) => file.endsWith('.md'))
          .map((file: string) => file.replace('.md', ''))

        // Add only public presentation routes for prerendering
        const publicRoutes = slugs.flatMap((slug: string) => [
          `/slides/${slug}`,
          `/api/presentations/${slug}`,
        ])

        nitroConfig.prerender = nitroConfig.prerender || {}
        nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
        nitroConfig.prerender.routes.push(...publicRoutes)
      }
      catch (error) {
        // Public folder may not exist yet, that's okay
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
