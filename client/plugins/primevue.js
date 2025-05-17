import { defineNuxtPlugin } from '#app'
import PrimeVue from 'primevue/config'
import Paginator from 'primevue/paginator'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, {
    ripple: true
  })
  
  // Enregistrement global du composant Paginator
  nuxtApp.vueApp.component('Paginator', Paginator)
})
