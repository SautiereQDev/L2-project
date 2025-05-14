import { defineNuxtPlugin } from '#app'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Plugin Nuxt pour TanStack Vue Query
export default defineNuxtPlugin(({ vueApp }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: import.meta.env.PROD // uniquement en prod
      }
    }
  })
  vueApp.use(VueQueryPlugin, { queryClient })
})
