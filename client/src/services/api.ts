import axios from 'axios'
import type { AxiosResponse } from 'axios'
import authService from './auth.service'

// Define base URL for API - use Vite proxy
const API_URL = '/api'

// Create axios instance with proxy support
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Désactiver la vérification SSL en dev pour éviter les problèmes de certificat
  ...(import.meta.env.DEV ? { httpsAgent: { rejectUnauthorized: false } } : {})
})

// Interceptor pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  config => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Interceptor pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  response => response,
  async error => {
    // Si l'erreur est due à un problème de certificat en développement, log mais ne bloque pas
    if (import.meta.env.DEV && (error.code === 'ERR_CERT_AUTHORITY_INVALID' || error.message?.includes('certificate'))) {
      console.warn('Erreur de certificat SSL ignorée en développement:', error.message);
      // Renvoyer une réponse factice pour le développement
      return Promise.resolve({
        data: {
          status: 'mock',
          timestamp: new Date().toISOString(),
          database: { connected: true },
          environment: {
            php_version: '8.2.0',
            symfony_version: '6.3.0',
            server: { software: 'mock-server', protocol: 'HTTP/1.1' }
          },
          message: 'API simulée en dev - erreur SSL ignorée'
        }
      });
    }
    
    // Si erreur 401, tenter de rafraîchir le token
    if (error.response && error.response.status === 401) {
      try {
        const refreshed = await authService.refreshTokenIfNeeded();
        if (refreshed) {
          // Répéter la requête avec le nouveau token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${authService.getToken()}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        // Convertir l'erreur en instance d'Error si ce n'en est pas une
        return Promise.reject(refreshError instanceof Error ? refreshError : new Error(String(refreshError)));
      }
    }
    
    // Convertir l'erreur en instance d'Error si ce n'en est pas une
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Define response interfaces
interface HealthResponse {
  status: string
  timestamp: string
  database: {
    connected: boolean
  }
  environment: {
    php_version: string
    symfony_version: string
    server: {
      software: string
      protocol: string
    }
  }
  message: string
}

// API service
export default {
  // Health check endpoint
  checkHealth(): Promise<AxiosResponse<HealthResponse>> {
    return apiClient.get('/v1/health')
  }
}
