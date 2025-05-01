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

/**
 * Gère les réponses avec erreur 401 (Non autorisé)
 * @param response La réponse HTTP
 * @param authStore Le store d'authentification
 * @param originalFetch La fonction fetch originale
 * @param input La requête originale
 * @param init Les options de la requête originale
 * @returns Une nouvelle réponse ou re-lance l'erreur
 */
async function handleUnauthorizedResponse(
  response: Response,
  authStore: ReturnType<typeof useAuthStore>,
  originalFetch: typeof fetch,
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (response.status === 401) {
    console.warn('Fetch: Erreur 401 reçue, tentative de rafraîchissement du token');
    
    // Supprimer le token actuel qui est invalide
    authStore.logout();
    
    // Tenter d'obtenir un nouveau token
    try {
      const refreshSuccessful = await authStore.refreshTokenIfNeeded();
      
      if (refreshSuccessful && authStore.token) {
        console.log('Fetch: Token rafraîchi avec succès après erreur 401, répétition de la requête');
        
        // Préparer une nouvelle requête avec le token rafraîchi
        const updatedInit: RequestInit = { ...(init ?? {}) };
        updatedInit.headers = { ...(updatedInit.headers as Record<string, string> ?? {}) };
        updatedInit.headers.Authorization = `Bearer ${authStore.token}`;
        
        // Retenter la requête originale avec le nouveau token
        return originalFetch(input, updatedInit);
      }
    } catch (error) {
      console.error('Fetch: Exception lors du rafraîchissement du token après erreur 401:', error);
    }
    
    // Si nous arrivons ici, c'est que le rafraîchissement a échoué
    throw new Error('Session expirée - veuillez vous reconnecter');
  }
  
  // Si ce n'est pas une erreur 401, retourner la réponse originale
  return response;
}

export function createAuthInterceptor(originalFetch: typeof fetch): typeof fetch {
  return async function interceptedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Obtenir le store d'authentification
    const authStore = useAuthStore();
    
    // Détecter si c'est un appel API local via proxy
    const isProxiedApiCall = typeof input === 'string' && input.startsWith('/api');
    
    // Si c'est un appel API et que nous avons un token
    if (isProxiedApiCall && authStore.token) {
      // Vérifier si le token est expiré avant d'envoyer la requête
      if (authStore.isTokenExpired()) {
        console.warn('Fetch: Token expiré détecté avant envoi de requête, tentative de rafraîchissement');
        
        // Supprimer le token expiré avant de tenter le rafraîchissement
        authStore.logout();  // Utiliser logout pour nettoyer proprement
        
        // Tenter de rafraîchir le token
        await authStore.refreshTokenIfNeeded();
        
        // Vérifier si l'authentification a échoué après tentative de rafraîchissement
        if (!authStore.isAuthenticated) {
          console.warn('Fetch: Le token a expiré et n\'a pas pu être rafraîchi');
        }
      } else {
        // Le token semble valide, mais vérifions s'il va bientôt expirer
        await authStore.refreshTokenIfNeeded(5);
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
    const response = await originalFetch(input, updatedInit);
    
    // Gérer les réponses avec erreur 401
    return handleUnauthorizedResponse(response, authStore, originalFetch, input, init);
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
