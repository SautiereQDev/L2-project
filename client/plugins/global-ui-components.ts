// Module de composants UI global
// Cela s'assure que tous les composants U* sont disponibles globalement

import * as components from '#components'

export default defineNuxtPlugin((nuxtApp) => {
  // Enregistrer tous les composants qui commencent par 'U' globalement
  Object.entries(components).forEach(([name, component]) => {
    if (name.startsWith('U')) {
      console.log(`Registering global UI component: ${name}`)
      nuxtApp.vueApp.component(name, component)
    }
  })
})
