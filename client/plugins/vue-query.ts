import { defineNuxtPlugin } from "#app";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";

/**
 * Plugin pour initialiser TanStack Vue Query avec Nuxt 3
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Créer le queryClient avec configuration optimisée
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
        refetchOnWindowFocus: process.env.NODE_ENV === "production",
        refetchOnReconnect: true,
      },
    },
  });

  // Installer le plugin avec les options
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  // Exposer le queryClient à l'application Nuxt
  return {
    provide: {
      queryClient,
    },
  };
});
