/**
 * Store pour gérer l'authentification de l'utilisateur
 * Utilise Pinia pour la gestion d'état
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { authService } from '../services/auth.service';
import type { AuthCredentials, UserProfile } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // Vérifier l'environnement client pour localStorage
  const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  // État
  const token = ref<string | null>(isClient ? window.localStorage.getItem('auth_token') : null);
  const isAuthenticating = ref(false);
  const authError = ref<string | null>(null);
  const userProfile = ref<UserProfile | null>(null);
  const tokenExpiration = ref<number | null>(parseTokenExpiration(token.value));

  // Getters
  const isAuthenticated = computed(() => !!token.value && !isTokenExpired());
  const isAdmin = computed(() => userProfile.value?.roles?.includes('ROLE_ADMIN') ?? false);

  /**
   * Vérifie si le token est expiré
   */
  function isTokenExpired(): boolean {
    if (!tokenExpiration.value) return true;
    return Date.now() >= tokenExpiration.value * 1000; // Convertir en millisecondes
  }

  /**
   * Extrait l'expiration d'un token JWT
   */
  function parseTokenExpiration(jwt: string | null): number | null {
    if (!jwt) return null;
    
    try {
      // Décoder le payload du token (partie du milieu)
      const payloadPart = jwt.split('.')[1];
      const payload = payloadPart ? JSON.parse(atob(payloadPart)) : null;
      return payload.exp ?? null;
    } catch (error) {
      console.error('Erreur lors du décodage du token:', error);
      return null;
    }
  }

  /**
   * Connecte un utilisateur
   */
  async function login(credentials: AuthCredentials): Promise<boolean> {
    try {
      isAuthenticating.value = true;
      authError.value = null;
      
      const result = await authService.login(credentials);
      
      if (result.success) {
        // Stocker le token et son expiration
        token.value = result.token ?? null;
        tokenExpiration.value = parseTokenExpiration(result.token ?? null);
        if (result.token && isClient) {
          window.localStorage.setItem('auth_token', result.token);
        }
        
        // Récupérer le profil utilisateur
        await fetchUserProfile();
        return true;
      } else {
        authError.value = result.error ?? 'Échec de connexion';
        return false;
      }
    } catch (error: any) {
      authError.value = error.message ?? 'Erreur inattendue lors de la connexion';
      return false;
    } finally {
      isAuthenticating.value = false;
    }
  }

  /**
   * Récupère le profil de l'utilisateur 
   */
  async function fetchUserProfile(): Promise<boolean> {
    if (!token.value) return false;
    
    try {
      const profile = await authService.getUserProfile();
      userProfile.value = profile;
      return profile !== null;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return false;
    }
  }

  /**
   * Déconnecte l'utilisateur
   */
  function logout(): void {
    token.value = null;
    tokenExpiration.value = null;
    userProfile.value = null;
    if (isClient) {
      window.localStorage.removeItem('auth_token');
    }
  }

  /**
   * Rafraîchit le token s'il est sur le point d'expirer
   * @param minimumValidityMinutes Nombre de minutes minimum avant d'envisager le rafraîchissement
   */
  async function refreshTokenIfNeeded(minimumValidityMinutes: number = 5): Promise<boolean> {
    if (!token.value || !tokenExpiration.value) return false;
    
    // Calculer le temps restant en minutes
    const expirationTime = tokenExpiration.value * 1000; // en ms
    const currentTime = Date.now();
    const timeLeftMs = expirationTime - currentTime;
    const timeLeftMinutes = timeLeftMs / (1000 * 60);
    
    // Si le token expire dans moins que le minimum spécifié, on le rafraîchit
    if (timeLeftMinutes < minimumValidityMinutes) {
      try {
        const result = await authService.refreshToken();
        if (result.success && result.token) {
          token.value = result.token;
          tokenExpiration.value = parseTokenExpiration(result.token);
          if (isClient) {
            window.localStorage.setItem('auth_token', result.token);
          }
          return true;
        }
        return false;
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        return false;
      }
    }
    
    return true; // Le token est encore valide assez longtemps
  }

  // Retourner les fonctions et propriétés exposées
  return {
    // État
    token,
    isAuthenticating,
    authError,
    userProfile,
    
    // Getters
    isAuthenticated,
    isAdmin,
    
    // Actions
    login,
    logout,
    refreshTokenIfNeeded,
    fetchUserProfile,
    isTokenExpired
  };
});
