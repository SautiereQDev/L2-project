// Using Nuxt's composables system
import { useNuxtApp } from '#app'

/**
 * Composable pour gérer les toasts (notifications) de l'application
 * Basé sur le composable useToast de NuxtUI mais avec des options par défaut pour notre application
 */
export function useAppToast() {
  // Using Nuxt's built-in toast system
  const nuxtApp = useNuxtApp()
  // Type assertion for toast to avoid "unknown" type errors
  const toast = nuxtApp.$toast as {
    add: (options: {
      title?: string;
      description?: string;
      color?: string;
      icon?: string;
      timeout?: number;
    }) => void;
  }

  /**
   * Affiche un toast de succès
   * @param message Le message à afficher
   */
  const success = (message: string) => {
    toast.add({
      title: 'Succès',
      description: message,
      color: 'success',
      icon: 'i-heroicons-check-circle',
      timeout: 3000
    })
  }

  /**
   * Affiche un toast d'information
   * @param message Le message à afficher
   */
  const info = (message: string) => {
    toast.add({
      title: 'Information',
      description: message,
      color: 'info',
      icon: 'i-heroicons-information-circle',
      timeout: 5000
    })
  }

  /**
   * Affiche un toast d'avertissement
   * @param message Le message à afficher
   */
  const warning = (message: string) => {
    toast.add({
      title: 'Attention',
      description: message,
      color: 'warning',
      icon: 'i-heroicons-exclamation-triangle',
      timeout: 5000
    })
  }

  /**
   * Affiche un toast d'erreur
   * @param message Le message à afficher
   */
  const error = (message: string) => {
    toast.add({
      title: 'Erreur',
      description: message,
      color: 'error',
      icon: 'i-heroicons-x-circle',
      timeout: 7000
    })
  }

  return {
    success,
    info,
    warning,
    error,
    // Expose the original toast instance for advanced usage
    add: toast.add
  }
}
