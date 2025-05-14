import { defineNuxtPlugin } from '#app'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from '~/utils/vue-query-client'

/**
 * Plugin pour initialiser TanStack Vue Query avec Nuxt 3
 */
export default defineNuxtPlugin(nuxtApp => {
  // Utiliser le queryClient importé depuis utils/vue-query-client.ts
  
  // Installer le plugin avec les options
  // Pour @tanstack/vue-query v5+, nous utilisons directement l'objet nuxtApp
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
  
  // Exposer le queryClient à l'application Nuxt
  return {
    provide: {
      queryClient,
    },
  }
})
