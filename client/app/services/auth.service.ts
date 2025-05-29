/**
 * Service d'authentification et gestion des tokens JWT
 * Gère les opérations liées à l'authentification des utilisateurs
 */
import {ref, reactive} from 'vue';
import type {
  AuthCredentials,
  AuthResponse,
  RefreshResponse,
  UserProfile,
  UserRegistrationCredentials,
  RegistrationResponse
} from '~/types';
import {isTokenExpired, shouldRefreshToken, getTokenRemainingTime} from '~/utils/jwt.utils';

// Utiliser le proxy Vite pour éviter les problèmes de certificat
const API_URL = '/api';
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

// Détecter l'environnement client (browser) pour éviter le SSR
const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

// Récupérer le token du localStorage au démarrage (uniquement en browser)
const authToken = ref<string | null>(isClient ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null);
const userData = ref<UserProfile | null>(null);

// Initialiser les données utilisateur depuis le localStorage si disponibles
if (isClient) {
  const storedUserData = window.localStorage.getItem(USER_DATA_KEY);
  if (storedUserData) {
    try {
      userData.value = JSON.parse(storedUserData);
    } catch (e) {
      console.error('Erreur lors du parsing des données utilisateur', e);
    }
  }
}

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
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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

      // Récupérer la réponse sous forme de texte
      const responseText = await response.text();
      console.log('Réponse brute du serveur:', responseText);

      // Essayer de parser la réponse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Données de connexion parsées:', data);
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        return {
          success: false,
          error: 'Format de réponse invalide'
        };
      }

      // Si les données existent mais pas le token, on cherche dans data.token ou data.data.token
      if (!data.token && data.data && data.data.token) {
        data.token = data.data.token;
      }

      // Vérifier si le token existe dans la réponse
      if (!data.token) {
        console.error('Token manquant dans la réponse:', data);
        return {
          success: false,
          errors: 'Token manquant dans la réponse'
        };
      }

      // Stocker le token dans le localStorage et dans la référence
      authToken.value = data.token;
      if (isClient) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }

      // Stocker les informations utilisateur si présentes
      if (data.user) {
        userData.value = data.user;
        if (isClient) {
          window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
        }
      }

      console.log('Authentification réussie, token obtenu et stocké');

      // Retourner une réponse de succès avec le token et l'utilisateur
      return {
        success: true,
        token: data.token,
        user: data.user || null
      };
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue lors de la connexion'
      };
    }
  },

  /**
   * Inscription d'un nouvel utilisateur
   * @param userData - Données d'inscription
   * @returns Réponse d'inscription avec utilisateur créé si succès
   */
  async register(userData: UserRegistrationCredentials): Promise<RegistrationResponse> {
    try {
      console.log('Inscription d\'un nouvel utilisateur avec email:', userData.email);

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Erreur d'inscription (${response.status}):`, errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { detail: errorText || `Erreur ${response.status}` };
        }

        // Extraire le message d'erreur de la réponse API Platform si disponible
        let errorMessage = `${response.status} ${response.statusText}`;
        if (errorData?.detail) {
          errorMessage = errorData.detail;
        } else if (errorData?.violations && errorData.violations.length > 0) {
          errorMessage = errorData.violations.map((v: any) => v.message).join(', ');
        }

        return {
          success: false,
          error: errorMessage
        };
      }

      // Récupérer la réponse sous forme de texte
      const responseText = await response.text();
      console.log('Réponse brute du serveur (inscription):', responseText);

      // Essayer de parser la réponse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Données d\'inscription parsées:', data);
      } catch (error) {
        console.error('Erreur de parsing JSON (inscription):', error);
        return {
          success: false,
          error: 'Format de réponse invalide'
        };
      }

      // Si l'inscription renvoie directement un token, le stocker
      if (data.token) {
        authToken.value = data.token;
        if (isClient) {
          window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        }
      }

      // Extraire les données utilisateur (peuvent être dans data.user ou directement dans data)
      const user = data.user || data;

      // Stocker les informations utilisateur
      if (user) {
        userData.value = user;
        if (isClient) {
          window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
        }
      }

      return {
        success: true,
        user: user
      };
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        error: error.message || 'Erreur inconnue lors de l\'inscription'
      };
    }
  },

  /**
   * Déconnexion de l'utilisateur
   */
  logout(): void {
    authToken.value = null;
    userData.value = null;
    if (isClient) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(USER_DATA_KEY);
    }
  },

  /**
   * Vérifier si l'utilisateur est authentifié
   * @returns true si un token existe et n'est pas expiré
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
   * Obtenir les données utilisateur
   * @returns Données utilisateur ou null
   */
  getUserData(): UserProfile | null {
    return userData.value;
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
      const response = await fetch(`/api/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken.value}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du profil: ${response.status}`);
      }

      const responseText = await response.text();
      let result;

      try {
        result = JSON.parse(responseText);
      } catch (error) {
        console.error('Erreur parsing JSON (profil):', error);
        return null;
      }

      // Déterminer où se trouvent les données utilisateur
      let userProfile: UserProfile;

      if (result.success && result.data) {
        userProfile = result.data;
      } else if (result.user) {
        userProfile = result.user;
      } else {
        userProfile = result;
      }

      // Mettre à jour les données utilisateur en cache
      userData.value = userProfile;
      if (isClient) {
        window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(userProfile));
      }

      return userProfile;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      return null;
    }
  },

  /**
   * Rafraîchit le token si nécessaire
   * @param minValidTime Temps minimum de validité requis en secondes
   * @returns Réponse de rafraîchissement
   */
  async refreshTokenIfNeeded(minValidTime: number = 300): Promise<RefreshResponse> {
    // Si pas de token, échec immédiat
    if (!authToken.value) {
      return { success: false, error: 'Aucun token à rafraîchir' };
    }

    // Si le token n'a pas besoin d'être rafraîchi, succès immédiat
    if (!shouldRefreshToken(authToken.value, minValidTime)) {
      return { success: true, token: authToken.value };
    }

    // Sinon, tenter le rafraîchissement
    try {
      console.log('Rafraîchissement du token...');
      const response = await fetch(`${API_URL}/v1/token/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.value}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur lors du rafraîchissement du token: ${response.status}`);
      }

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error('Erreur parsing JSON (refresh token):', error);
        return { success: false, error: 'Format de réponse invalide' };
      }

      // Vérifier si le nouveau token est présent
      if (!data?.token) {
        return { success: false, error: 'Nouveau token manquant dans la réponse' };
      }

      // Mettre à jour le token
      authToken.value = data.token;
      if (isClient) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
      }

      return { success: true, token: data.token };
    } catch (error: any) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      return { success: false, error: error.message };
    }
  }
};

export default authService;
