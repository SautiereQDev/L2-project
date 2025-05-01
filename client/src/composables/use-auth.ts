/**
 * Composable pour gérer l'authentification et les sessions utilisateurs
 * Fournit des méthodes utilitaires pour vérifier et maintenir l'état d'authentification
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { getTokenRemainingTime } from '@/utils/jwt.utils'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  
  // États réactifs
  const isAuthenticating = ref(false)
  const authError = ref<string | null>(null)
  
  // Durée de vie du token en secondes (mise à jour régulièrement)
  const tokenTTL = computed(() => getTokenRemainingTime(authStore.token))
  
  // Indique si l'utilisateur est connecté
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  // Indique si l'utilisateur a un rôle admin
  const isAdmin = computed(() => authStore.isAdmin)
  
  /**
   * Connecter un utilisateur avec informations d'identification
   */
  async function login(email: string, password: string): Promise<boolean> {
    isAuthenticating.value = true
    authError.value = null
    
    try {
      const success = await authStore.login({ email, password })
      
      if (!success) {
        authError.value = authStore.authError ?? 'Échec de connexion'
      }
      
      return success
    } catch (error: any) {
      authError.value = error.message ?? 'Erreur inattendue lors de la connexion'
      return false
    } finally {
      isAuthenticating.value = false
    }
  }
  
  /**
   * Déconnecter un utilisateur et rediriger vers la page de login
   */
  function logout(redirectToLogin: boolean = true): void {
    authStore.logout()
    
    if (redirectToLogin) {
      router.push('/login')
    }
  }
  
  /**
   * Vérifier et rafraîchir la session si nécessaire
   */
  async function checkSession(): Promise<boolean> {
    // Si l'utilisateur n'est pas connecté, rien à faire
    if (!isAuthenticated.value) {
      return false
    }
    
    try {
      // Rafraîchir le token si nécessaire
      return await authStore.refreshTokenIfNeeded()
    } catch (error) {
      console.error('Erreur lors de la vérification de session:', error)
      return false
    }
  }
  
  /**
   * Rediriger vers une page sécurisée après connexion
   */
  function redirectAfterLogin(defaultPath: string = '/'): void {
    // Récupérer la redirection demandée depuis l'URL si elle existe
    const redirectParam = new URLSearchParams(window.location.search).get('redirect')
    
    // Si un paramètre redirect existe et semble être un chemin interne valide, l'utiliser
    // sinon utiliser le chemin par défaut
    const targetPath = redirectParam?.startsWith('/') 
      ? redirectParam 
      : defaultPath
    
    router.push(targetPath)
  }
  
  return {
    // États
    isAuthenticating,
    authError,
    tokenTTL,
    isAuthenticated,
    isAdmin,
    
    // Méthodes
    login,
    logout,
    checkSession,
    redirectAfterLogin,
    
    // Store sous-jacent pour des opérations avancées
    store: authStore
  }
}
