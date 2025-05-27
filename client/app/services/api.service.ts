/**
 * Service pour gérer les requêtes API
 * Fournit une interface type-safe pour communiquer avec le backend
 */
import authService from './auth.service';
import type {ApiError} from '../types/api.types';

export class ApiService {
  /**
   * URL de base de l'API - utilise le proxy Vite configuré dans vite.config.ts
   */
  private readonly baseUrl: string = '/api';

  /**
   * Méthode pour effectuer une connexion et obtenir un token
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns Promise<boolean> - true si authentification réussie, false sinon
   */
  async authenticate(email: string, password: string): Promise<boolean> {
    const response = await authService.login({email, password});
    return !!response && !('error' in response);
  }

  /**
   * Vérifier si un token est disponible et valide, sinon tenter une connexion
   * @returns Promise<boolean> - true si l'authentification est valide
   */
  private async ensureAuthenticated(): Promise<boolean> {
    // Si nous ne sommes pas authentifiés ou si le token est expiré
    if (!authService.isAuthenticated() || authService.isTokenExpired()) {
      return await this.authenticate('sautiereq@gmail.com', 'abcd1234');
    }
    return true;
  }

  /**
   * Méthode générique pour effectuer des requêtes GET
   * @param endpoint - Chemin de l'API sans la base URL
   * @param params - Paramètres de requête optionnels
   * @returns Promise<T> - Données typées retournées par l'API
   */
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    // S'assurer que nous sommes authentifiés avant de faire la requête
    console.log('Vérification de l\'authentification avant requête GET à', endpoint);
    const authSuccess = await this.ensureAuthenticated();
    if (!authSuccess) {
      throw new Error("Échec de l'authentification");
    }

    // Construire l'URL complète - utiliser le proxy Vite
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    console.log('Requête API via proxy Vite:', url.toString());

    try {
      // Récupérer le token d'authentification
      const authToken = authService.getToken();

      // Effectuer la requête API réelle via le proxy Vite
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur API: ${response.status} ${response.statusText}`);

        // En cas d'erreur d'authentification, tenter une nouvelle authentification
        if (response.status === 401) {
          console.log('Token expiré ou invalide, tentative de réauthentification...');
          const reconnected = await this.authenticate('sautiereq@gmail.com', 'abcd1234');

          if (reconnected) {
            console.log('Réauthentification réussie, nouvelle tentative de requête');
            return await this.get<T>(endpoint, params);
          }
        }

        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();

      // Gérer la réponse Hydra de API Platform pour les collections
      if (responseData && typeof responseData === 'object') {
        if (responseData['@type'] === 'hydra:Collection' && responseData['hydra:member']) {
          return {
            items: responseData['hydra:member'],
            totalItems: responseData['hydra:totalItems'] ?? responseData['hydra:member'].length,
            view: responseData['hydra:view'] ?? null
          } as unknown as T;
        }

        // Si c'est un tableau JSON standard
        if (Array.isArray(responseData)) {
          return {
            items: responseData,
            totalItems: responseData.length,
            view: null
          } as unknown as T;
        }
      }

      return responseData as T;
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      throw error;
    }
  }

  // Méthode pour effectuer des requêtes POST
  async post<T>(endpoint: string, requestData: any): Promise<T> {
    // S'assurer que nous sommes authentifiés avant de faire la requête
    console.log('Authentification avant requête POST');
    const authSuccess = await this.ensureAuthenticated();
    if (!authSuccess) {
      throw new Error("Échec de l'authentification");
    }

    const url = `${this.baseUrl}${endpoint}`;
    const authToken = authService.getToken();

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur API POST: ${response.status} ${response.statusText}`);

        // Pour les erreurs d'authentification, tenter une nouvelle authentification
        if (response.status === 401) {
          console.log('Token expiré, tentative de réauthentification...');
          const reconnected = await this.authenticate('sautiereq@gmail.com', 'abcd1234');

          if (reconnected) {
            console.log('Réauthentification réussie, nouvelle tentative de requête POST');
            return await this.post<T>(endpoint, requestData);
          }
        }

        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error('Erreur lors de la requête POST:', error);
      throw error;
    }
  }

  /**
   * Méthode pour effectuer des requêtes PUT (mise à jour de données)
   * @param endpoint - Chemin de l'API sans la base URL
   * @param requestData - Données à envoyer pour la mise à jour
   * @returns Promise<T> - Données mises à jour
   */
  async put<T>(endpoint: string, requestData: any): Promise<T> {
    // S'assurer que nous sommes authentifiés avant de faire la requête
    console.log('Authentification avant requête PUT');
    const authSuccess = await this.ensureAuthenticated();
    if (!authSuccess) {
      throw new Error("Échec de l'authentification");
    }

    const url = `${this.baseUrl}${endpoint}`;
    const authToken = authService.getToken();

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestData),
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur API PUT: ${response.status} ${response.statusText}`);

        // Pour les erreurs d'authentification, tenter une nouvelle authentification
        if (response.status === 401) {
          console.log('Token expiré, tentative de réauthentification...');
          const reconnected = await this.authenticate('sautiereq@gmail.com', 'abcd1234');

          if (reconnected) {
            console.log('Réauthentification réussie, nouvelle tentative de requête PUT');
            return await this.put<T>(endpoint, requestData);
          }
        }

        // Essayez d'analyser l'erreur en tant qu'ApiError
        try {
          const errorData = await response.json() as ApiError;
          throw new Error(errorData.detail || errorData.title || `Erreur ${response.status}`);
        } catch {
          // Si l'erreur n'est pas au format JSON ou n'est pas une ApiError
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la requête API PUT:', error);
      throw error;
    }
  }
}

export default new ApiService();