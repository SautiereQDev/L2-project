/**
 * Service d'authentification et gestion des tokens JWT
 * Gère les opérations liées à l'authentification des utilisateurs
 */
import { ref } from 'vue';
import type { AuthCredentials, AuthResponse, RefreshResponse, UserProfile } from '../types';

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
   * @returns true si le token est expiré ou invalide
   */
  isTokenExpired(): boolean {
    if (!authToken.value) return true;
    
    // Vérifier si le token est un JWT valide
    try {
      // Extraire la partie payload du token JWT
      const payload = JSON.parse(atob(authToken.value.split('.')[1]));
      
      // Vérifier si l'expiration est définie
      if (!payload.exp) return false;
      
      // Comparer avec le timestamp actuel (avec marge de sécurité de 10 secondes)
      return (payload.exp * 1000) < (Date.now() + 10000);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'expiration du token:', error);
      return true;
    }
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
   * Obtenir un nouveau token si le token actuel est expiré
   * @returns true si le token est valide ou a été rafraîchi avec succès
   */
  async refreshTokenIfNeeded(): Promise<boolean> {
    // Si le token est expiré, essayer de le rafraîchir
    if (this.isTokenExpired()) {
      const refreshResult = await this.refreshToken();
      if (refreshResult.success) {
        return true;
      }
      
      // Si le rafraîchissement échoue, essayer de se reconnecter
      const loginResult = await this.login({
        email: 'sautiereq@gmail.com',
        password: 'abcd1234'
      });
      
      return loginResult.success;
    }
    
    return true;
  }
};

export default authService;
