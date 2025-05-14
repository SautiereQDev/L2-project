// Fichier nuxt.d.ts pour ajouter des types personnalisés
import { type QueryClient } from '@tanstack/vue-query'

declare module '#app' {
  interface NuxtApp {
    $queryClient: QueryClient
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $queryClient: QueryClient
  }
}

export { }
