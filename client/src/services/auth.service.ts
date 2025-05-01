/**
 * Service d'authentification et gestion des tokens JWT
 * Gère les opérations liées à l'authentification des utilisateurs
 */
import { ref } from 'vue';
import type { AuthCredentials, AuthResponse, RefreshResponse, UserProfile } from '../types';
import { isTokenExpired, shouldRefreshToken, getTokenRemainingTime } from '../utils/jwt.utils';

// Utiliser le proxy Vite pour éviter les problèmes de certificat
const API_URL = '/api';
const AUTH_TOKEN_KEY = 'auth_token';

// Récupérer le token du localStorage au démarrage
const authToken = ref<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));

export const authService = {
  /**
   * Connexion avec l'API d'authentification
   * @param credentials - Identifiants de connexion
   * @returns Réponse d'authentification avec token si succès
   */
  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      console.log('Authentification avec', credentials.email);
      
      // Utiliser le proxy Vite pour éviter les problèmes de certificat
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur d'authentification: ${response.status} ${response.statusText}`);
        return { 
          success: false, 
          error: `${response.status} ${response.statusText}` 
        };
      }

      const data = await response.json();
      
      if (!data?.token) {
        console.error('Token manquant dans la réponse');
        return { 
          success: false, 
          error: 'Token manquant dans la réponse' 
        };
      }
      
      // Stocker le token dans le localStorage et dans la référence
      authToken.value = data.token;
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      console.log('Token obtenu:', data.token.substring(0, 20) + '...');
      
      return { 
        success: true, 
        token: data.token 
      };
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      return { 
        success: false, 
        error: error.message ?? 'Erreur inconnue lors de la connexion' 
      };
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    authToken.value = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns true si un token existe
   */
  isAuthenticated(): boolean {
    return !!authToken.value && !this.isTokenExpired();
  },

  /**
   * Obtenir le token pour les requêtes API
   * @returns Le token JWT ou null
   */
  getToken(): string | null {
    return authToken.value;
  },

  /**
   * Vérifier si le token est expiré
   * @param bufferSeconds Marge de sécurité en secondes (défaut: 30)
   * @returns true si le token est expiré ou invalide
   */
  isTokenExpired(bufferSeconds: number = 30): boolean {
    return isTokenExpired(authToken.value, bufferSeconds);
  },
  
  /**
   * Récupère le profil de l'utilisateur connecté
   * @returns Profil utilisateur ou null en cas d'erreur
   */
  async getUserProfile(): Promise<UserProfile | null> {
    if (!authToken.value) {
      console.warn('Tentative de récupération du profil sans être authentifié');
      return null;
    }
    
    try {
      console.log('Récupération du profil utilisateur...');
      const response = await fetch(`${API_URL}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        // En cas d'erreur 404, il est possible que l'endpoint ne soit pas encore implémenté
        if (response.status === 404 || response.status === 405) {
          console.warn(`Endpoint /users/me non disponible: ${response.status}`);
          // Renvoyer un profil factice en développement
          return {
            id: 1,
            email: 'user@example.com',
            firstName: 'Utilisateur',
            lastName: 'Test',
            roles: ['ROLE_USER'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
        
        throw new Error(`Erreur lors de la récupération du profil: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Erreur lors de la récupération du profil:', error);
      
      // En mode développement, retourner un profil factice
      if (import.meta.env.DEV) {
        console.warn('Utilisation d\'un profil factice en développement');
        return {
          id: 1,
          email: 'dev@example.com',
          firstName: 'Dev',
          lastName: 'User',
          roles: ['ROLE_USER', 'ROLE_ADMIN'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      
      return null;
    }
  },

  /**
   * Rafraîchit le token d'authentification
   * @returns Réponse avec nouveau token si succès
   */
  async refreshToken(): Promise<RefreshResponse> {
    try {
      if (!authToken.value) {
        return { success: false, error: 'Aucun token à rafraîchir' };
      }
      
      const response = await fetch(`${API_URL}/token/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken.value}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        return { 
          success: false, 
          error: `Échec du rafraîchissement: ${response.status}` 
        };
      }
      
      const data = await response.json();
      if (!data?.token) {
        return { 
          success: false, 
          error: 'Pas de token dans la réponse' 
        };
      }
      
      // Mettre à jour le token
      authToken.value = data.token;
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      
      return { success: true, token: data.token };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message ?? 'Erreur lors du rafraîchissement du token' 
      };
    }
  },
  
  /**
   * Obtenir un nouveau token si le token actuel est expiré ou va bientôt expirer
   * @param thresholdMinutes Minutes avant expiration pour déclencher un rafraîchissement (défaut: 5)
   * @returns true si le token est valide ou a été rafraîchi avec succès
   */
  async refreshTokenIfNeeded(thresholdMinutes: number = 5): Promise<boolean> {
    // Si pas de token, rien à faire
    if (!authToken.value) return false;
    
    // Vérifier si le token est complètement expiré
    if (isTokenExpired(authToken.value, 0)) {
      console.warn("Token expiré, tentative de rafraîchissement...");
      
      // Nettoyer le token expiré pour éviter de l'envoyer dans les requêtes
      this.clearExpiredToken();
      
      const refreshResult = await this.refreshToken();
      if (refreshResult.success) {
        console.log("Token rafraîchi avec succès");
        return true;
      }
      
      console.warn("Rafraîchissement échoué, tentative de reconnexion...");
      // Si le rafraîchissement échoue, essayer la reconnexion silencieuse
      try {
        const loginResult = await this.login({
          email: 'sautiereq@gmail.com',
          password: 'abcd1234'
        });
        
        if (loginResult.success) {
          console.log("Reconnexion réussie avec de nouvelles informations d'identification");
        } else {
          console.error("Échec de la reconnexion");
        }
        
        return loginResult.success;
      } catch (error) {
        console.error("Exception lors de la tentative de reconnexion:", error);
        return false;
      }
    }
    
    // Vérifier si le token va bientôt expirer (dans les X minutes)
    if (shouldRefreshToken(authToken.value, thresholdMinutes)) {
      console.log(`Token valide mais expire bientôt (< ${thresholdMinutes} min), rafraîchissement préventif...`);
      try {
        const refreshResult = await this.refreshToken();
        if (refreshResult.success) {
          console.log("Token rafraîchi préventivement avec succès");
        } else {
          console.warn("Échec du rafraîchissement préventif");
        }
        return refreshResult.success;
      } catch (error) {
        console.error("Exception lors du rafraîchissement préventif:", error);
        return false;
      }
    }
    
    // Le token est encore valide et n'est pas près d'expirer
    const remainingMinutes = Math.floor(getTokenRemainingTime(authToken.value) / 60);
    console.log(`Token valide pour encore ~${remainingMinutes} minutes, pas besoin de rafraîchir`);
    return true;
  },
  
  /**
   * Efface un token expiré du stockage local et de la référence
   */
  clearExpiredToken(): void {
    console.log("Suppression du token expiré");
    authToken.value = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

export default authService;
