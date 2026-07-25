import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Fridge to Dinner',
        short_name: 'Fridge2Dinner',
        description: "Turn what's in your fridge into tonight's dinner.",
        theme_color: '#F1F4EC',
        background_color: '#F1F4EC',
        display: 'standalone',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [{
          urlPattern: /\/api\/recipes\/suggestions/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'suggestions-cache',
            expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 },
          },
        }],
      },
    }),
  ],
})
