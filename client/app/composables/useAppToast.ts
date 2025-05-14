// Import the useToast composable from Nuxt UI
import { useToast } from '#imports'

/**
 * Composable pour gérer les toasts (notifications) de l'application
 * Basé sur le composable useToast de NuxtUI mais avec des options par défaut pour notre application
 */
export function useAppToast() {
  // Using Nuxt UI's built-in toast system
  const toast = useToast()

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
      duration: 3000
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
      duration: 5000
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
      duration: 5000
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
      duration: 7000
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
