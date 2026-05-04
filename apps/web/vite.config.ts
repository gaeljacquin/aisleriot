import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { VitePWA } from 'vite-plugin-pwa'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    viteReact(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
      },
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'logo.png',
        'logo-192.png',
        'logo-512.png',
        'logo-dark.png',
        'logo.jpg',
        'logo-dark.jpg',
        'logo.webp',
      ],
      manifest: {
        short_name: 'Aisleriot',
        name: 'Aisleriot',
        description: 'A collection of solitaire card games',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon',
          },
          {
            src: 'logo-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'any',
          },
          {
            src: 'logo-512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'any',
          },
          {
            src: 'logo.png',
            type: 'image/png',
            sizes: '1024x1024',
            purpose: 'any',
          },
          {
            src: 'logo-192.png',
            type: 'image/png',
            sizes: '192x192',
            purpose: 'maskable',
          },
          {
            src: 'logo-512.png',
            type: 'image/png',
            sizes: '512x512',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      react: fileURLToPath(new URL('./node_modules/react', import.meta.url)),
      'react-dom': fileURLToPath(
        new URL('./node_modules/react-dom', import.meta.url),
      ),
    },
  },
  server: {
    allowedHosts: true,
  },
  build: {
    chunkSizeWarningLimit: 600,
  },
})

export default config
