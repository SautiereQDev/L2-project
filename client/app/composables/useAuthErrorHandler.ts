/**
 * Composable pour gérer les erreurs d'authentification
 */
import { authService } from '~/services/auth.service'
import type { ApiError } from '~/types/auth.types'

export const useAuthErrorHandler = () => {
  /**
   * Gère les erreurs d'authentification automatiquement
   * @param error Erreur reçue de l'API
   * @returns true si l'erreur a été gérée automatiquement
   */
  const handleAuthError = async (error: ApiError | Error | unknown): Promise<boolean> => {
    // Vérifier si c'est une erreur de token expiré
    const isExpiredToken = 
      (error as ApiError)?.code === 401 || 
      (error as ApiError)?.message?.includes('Expired JWT Token') ||
      (error as Error)?.message?.includes('401')

    if (isExpiredToken) {
      console.warn("Token expiré détecté, tentative de rafraîchissement automatique...")
      
      // Essayer de rafraîchir le token
      const refreshSuccess = await authService.refreshTokenIfNeeded(0)
      if (refreshSuccess) {
        console.log("Token rafraîchi automatiquement après erreur 401")
        return true
      }
      
      // Si le rafraîchissement échoue, forcer la déconnexion
      console.warn("Impossible de rafraîchir le token, déconnexion forcée")
      authService.forceReconnection()
      
      // Rediriger vers la page de connexion si on est côté client
      if (import.meta.client) {
        await navigateTo('/auth/login')
      }
      
      return true
    }
    
    return false
  }

  /**
   * Nettoie le token expiré du localStorage
   */
  const clearExpiredToken = (): void => {
    console.log("Suppression du token expiré")
    authService.logout()
  }

  /**
   * Force une reconnexion en cas de token expiré
   */
  const forceReconnection = async (): Promise<void> => {
    console.log("Suppression du token expiré pour forcer une nouvelle authentification")
    authService.logout()
    
    if (import.meta.client) {
      await navigateTo('/auth/login')
    }
  }

  return {
    handleAuthError,
    clearExpiredToken,
    forceReconnection
  }
}
