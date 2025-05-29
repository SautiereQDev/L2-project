import axios from "axios";
import type { AxiosResponse } from "axios";
import authService from "./auth.service";

// Define base URL for API - use Vite proxy
const API_URL = "/api";

// Create axios instance with proxy support
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/ld+json",
  },
  // Désactiver la vérification SSL en dev pour éviter les problèmes de certificat
  ...(import.meta.env.DEV ? { httpsAgent: { rejectUnauthorized: false } } : {}),
});

// Interceptor pour ajouter le token d'authentification et vérifier sa validité
apiClient.interceptors.request.use(
  async (config) => {
    // Vérifier d'abord si nous avons un token
    const token = authService.getToken();

    if (token) {
      // Vérifier si le token est expiré avant d'envoyer la requête
      if (authService.isTokenExpired()) {
        console.warn(
          "Token expiré détecté avant envoi de requête, tentative de rafraîchissement",
        );

        // Si le token est expiré, le supprimer pour éviter de l'envoyer
        authService.clearExpiredToken();

        // Tenter de le rafraîchir
        const refreshed = await authService.refreshTokenIfNeeded();

        // Si le rafraîchissement a réussi, utiliser le nouveau token
        if (refreshed) {
          const newToken = authService.getToken();
          if (newToken) {
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        }
      } else {
        // Le token est valide, l'utiliser
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

// Interceptor pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si l'erreur est due à un problème de certificat en développement, log mais ne bloque pas
    if (
      import.meta.env.DEV &&
      (error.code === "ERR_CERT_AUTHORITY_INVALID" ||
        error.message?.includes("certificate"))
    ) {
      console.warn(
        "Erreur de certificat SSL ignorée en développement:",
        error.message,
      );
      // Renvoyer une réponse factice pour le développement
      return Promise.resolve({
        data: {
          status: "mock",
          timestamp: new Date().toISOString(),
          database: { connected: true },
          environment: {
            php_version: "8.2.0",
            symfony_version: "6.3.0",
            server: { software: "mock-server", protocol: "HTTP/1.1" },
          },
          message: "API simulée en dev - erreur SSL ignorée",
        },
      });
    }

    // Si erreur 401 (Non autorisé - Token expiré ou invalide)
    if (error.response && error.response.status === 401) {
      console.warn(
        "Erreur 401 reçue:",
        error.response.data?.message ?? "Token invalide ou expiré",
      );

      // Supprimer immédiatement le token invalide
      authService.clearExpiredToken();

      try {
        // Tenter de récupérer un nouveau token
        console.log(
          "Tentative de récupération d'un nouveau token après erreur 401",
        );
        const refreshed = await authService.refreshTokenIfNeeded();

        if (refreshed) {
          console.log(
            "Token rafraîchi avec succès après erreur 401, répétition de la requête",
          );

          // Répéter la requête originale avec le nouveau token
          const originalRequest = error.config;
          const newToken = authService.getToken();

          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            // Répéter la requête originale avec le nouveau token
            return apiClient(originalRequest);
          } else {
            console.error("Token manquant après rafraîchissement");
          }
        } else {
          console.warn("Échec du rafraîchissement du token après erreur 401");
        }
      } catch (refreshError) {
        console.error(
          "Exception lors du rafraîchissement du token après erreur 401:",
          refreshError,
        );
      }

      // Si nous arrivons ici, c'est que le rafraîchissement a échoué ou qu'il n'y a pas de nouveau token
      // Enrichir l'erreur d'origine avec des informations utiles
      const enhancedError = new Error(
        "Session expirée - veuillez vous reconnecter",
      );
      enhancedError.name = "AuthError";
      // Stocker l'erreur d'origine sans utiliser la propriété cause (qui nécessite ES2022)
      (enhancedError as any).originalError = error;

      return Promise.reject(enhancedError);
    }

    // Pour les autres types d'erreurs (non liées à l'authentification)
    // Convertir l'erreur en instance d'Error si ce n'en est pas une
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error)),
    );
  },
);

// Define response interfaces
interface HealthResponse {
  status: string;
  timestamp: string;
  database: {
    connected: boolean;
  };
  environment: {
    php_version: string;
    symfony_version: string;
    server: {
      software: string;
      protocol: string;
    };
  };
  message: string;
}

// API service
const apiService = {
  // Health check endpoint
  checkHealth(): Promise<AxiosResponse<HealthResponse>> {
    return apiClient.get("/health");
  },

  // Récupérer un client API configuré pour être utilisé dans d'autres services
  getClient() {
    return apiClient;
  },
};

// Exporter le client API pour une utilisation directe
export { apiClient };

// Exporter le service API par défaut
export default apiService;
