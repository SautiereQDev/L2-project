/**
 * Intercepteur pour gérer le rafraîchissement automatique du token JWT
 */
import { useAuthStore } from '../stores/auth.store';

/**
 * Crée un intercepteur de requêtes fetch qui gère le rafraîchissement des tokens
 * @param originalFetch - La fonction fetch originale
 * @returns Une nouvelle fonction fetch avec l'interception
 */
/**
 * Ajoute un token d'authentification aux headers de la requête
 */
function addAuthorizationHeader(headers: HeadersInit, token: string): HeadersInit {
  if (headers instanceof Headers) {
    headers.set('Authorization', `Bearer ${token}`);
    return headers;
  } 
  
  if (Array.isArray(headers)) {
    return [...headers, ['Authorization', `Bearer ${token}`]];
  }
  
  // Headers est un objet ordinaire
  return { ...headers, 'Authorization': `Bearer ${token}` };
}

export function createAuthInterceptor(originalFetch: typeof fetch): typeof fetch {
  return async function interceptedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Obtenir le store d'authentification
    const authStore = useAuthStore();
    
    // Détecter si c'est un appel API local via proxy
    const isProxiedApiCall = typeof input === 'string' && input.startsWith('/api');
    
    // Si nous sommes authentifiés et que c'est un appel à notre API, vérifier le token
    if (isProxiedApiCall && authStore.isAuthenticated) {
      // Rafraîchir le token si nécessaire (5 minutes avant expiration)
      await authStore.refreshTokenIfNeeded(5);
      
      if (!authStore.isAuthenticated) {
        console.warn('Le token a expiré et n\'a pas pu être rafraîchi');
      }
    }
    
    // Créer un nouvel objet init s'il n'existe pas
    const updatedInit = init ? { ...init } : {};
    
    // Pour les appels API locaux, ajuster les options
    if (isProxiedApiCall) {
      // S'assurer que headers existe
      updatedInit.headers = updatedInit.headers || {};
      
      // Ajouter le token d'authentification si disponible
      if (authStore.token) {
        updatedInit.headers = addAuthorizationHeader(updatedInit.headers, authStore.token);
      }
      
      // Désactiver les vérifications de certificats en développement
      if (import.meta.env.DEV) {
        console.log(`Appel API proxié: ${input}`);
      }
    }
    
    // Effectuer la requête
    return originalFetch(input, updatedInit);
  };
}

/**
 * Enregistre l'intercepteur global pour fetch
 */
export function setupAuthInterceptor(): void {
  // Sauvegarder la fonction fetch originale
  const originalFetch = window.fetch;
  
  // Remplacer la fonction fetch globale par notre intercepteur
  window.fetch = createAuthInterceptor(originalFetch);
  
  console.log('Intercepteur d\'authentification installé');
}
