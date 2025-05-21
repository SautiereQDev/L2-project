// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      }
    },
    // Configuration pour transpiler les modules node si nécessaire
    transpile: process.env.NODE_ENV === 'production' ? ['leaflet'] : [],
  },

  modules: [// Pinia store support
  '@pinia/nuxt', '@nuxt/ui', '@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/image', '@primevue/nuxt-module', '@nuxtjs/leaflet'],
  // Enable default component auto-import (will import from components/ and app/components/)
  components: true,
  // Auto-import local components from the app/components directory
  
  imports: {
    dirs: ['utils', 'composables'],
  },
  
  // Explicit plugin configuration
  plugins: [
    './plugins/vue-query',
    './plugins/primevue.js',
  ],

  css: [
    '~/assets/css/main.css',
  ],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27',

  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://project.localhost:8443',
          changeOrigin: true,
          secure: false, // désactive la vérification du certificat SSL
          rewrite: path => path.replace(/^\/api/, '/api/v1')
        }
      }
    }
  },

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'tertiary',
        'info',
        'success',
        'warning',
        'error',
        'neutral',
        'running',
        'jumping',
        'throwing',
        'female',
        'male',
        'accent'
      ]
    }
  }
})

