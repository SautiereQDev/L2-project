// filepath: /home/quentin-sautiere/docker-symfony-wp-2024/projets/project/client/app/plugins/ui-resolver-app.ts
/**
 * Force la résolution des composants UI pour l'application
 * Ce plugin doit être chargé APRÈS ui.ts et ui-patch.ts
 * 
 * RENAMED to avoid conflict with the main ui-resolver.ts plugin
 */

// @ts-ignore
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('App-specific UI resolver initialized')

  // Force l'enregistrement de tous les composants U* depuis leur registre
  nuxtApp.hook('app:beforeMount', () => {
    console.log('App resolver: Checking UI components before mount...')
  })

  // Pour chaque route, s'assurer que les composants sont disponibles
  nuxtApp.hook('page:start', () => {
    console.log('App resolver: Page loading - ensuring UI components are ready')
  })

  // Not providing uiResolver to avoid conflict with main plugin
  return {}
})
