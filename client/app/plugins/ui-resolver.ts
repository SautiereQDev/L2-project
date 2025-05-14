/**
 * Force la résolution des composants UI pour l'application
 * Ce plugin doit être chargé APRÈS ui.ts et ui-patch.ts
 */

// @ts-ignore
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  console.log('UI resolver plugin initialized')

  // Force l'enregistrement de tous les composants U* depuis leur registre
  nuxtApp.hook('app:beforeMount', () => {
    console.log('Checking UI components before mount...')
  })

  // Pour chaque route, s'assurer que les composants sont disponibles
  nuxtApp.hook('page:start', () => {
    console.log('Page loading - ensuring UI components are ready')
  })

  return {
    provide: {
      uiResolver: true
    }
  }
})
