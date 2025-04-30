// Service pour gérer les requêtes API
import authService from './auth.service';

export class ApiService {
  // URL de base de l'API - utilise le proxy Vite configuré dans vite.config.ts
  private readonly baseUrl: string = '/api';
  
  // Méthode pour effectuer une connexion et obtenir un token
  async authenticate(email: string, password: string): Promise<boolean> {
    return await authService.login({ email, password });
  }
  
  // Vérifier si un token est disponible et valide, sinon tenter une connexion
  private async ensureAuthenticated(): Promise<boolean> {
    // Si nous ne sommes pas authentifiés ou si le token est expiré
    if (!authService.isAuthenticated() || authService.isTokenExpired()) {
      return await this.authenticate('sautiereq@gmail.com', 'abcd1234');
    }
    return true;
  }

  // Méthode générique pour effectuer des requêtes GET
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
}

export default new ApiService();
