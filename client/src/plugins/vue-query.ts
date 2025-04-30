// Vue Query Configuration
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Créer un client de requête avec des options de configuration
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Durée pendant laquelle les données sont considérées comme fraîches (en millisecondes)
      staleTime: 1000 * 60 * 5, // 5 minutes
      
      // Nombre de tentatives en cas d'échec
      retry: 1,

      // Stratégie de récupération lors du retour de la fenêtre au premier plan
      refetchOnWindowFocus: import.meta.env.PROD, // Uniquement en production
    },
  },
})

// Fonction d'installation du plugin Vue
export default {
  install(app: any) {
    app.use(VueQueryPlugin, { queryClient })
  }
}
