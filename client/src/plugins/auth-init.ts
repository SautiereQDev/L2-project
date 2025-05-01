/**
 * Plugin pour l'initialisation de l'authentification
 * Ce plugin charge les données d'authentification au démarrage de l'application
 */
import type { App } from 'vue';
import { useAuthStore } from '../stores/auth.store';

export default {
  install: (app: App) => {
    // Accéder au store après qu'il soit installé via createPinia()
    const authInit = async () => {
      // Cette fonction sera exécutée après le montage de l'application
      const authStore = useAuthStore();
      
      try {
        console.log('Initialisation de l\'authentification...');
        
        // Si pas de token, rien à faire
        if (!authStore.token) {
          console.log('Aucun token trouvé, utilisateur non authentifié');
          return;
        }
        
        // Gérer le token expiré
        if (authStore.isTokenExpired()) {
          await handleExpiredToken(authStore);
          return;
        }
        
        // Gérer le token valide
        await handleValidToken(authStore);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
        
        // En mode développement, ne pas déconnecter automatiquement
        if (!import.meta.env.DEV) {
          authStore.logout();
        }
      }
    };
    
    // Gérer le cas d'un token expiré
    async function handleExpiredToken(authStore: ReturnType<typeof useAuthStore>) {
      console.log('Token expiré, tentative de rafraîchissement...');
      const refreshed = await authStore.refreshTokenIfNeeded();
      
      if (refreshed) {
        console.log('Token rafraîchi avec succès');
      } else {
        console.warn('Échec du rafraîchissement du token, déconnexion');
        if (!import.meta.env.DEV) {
          authStore.logout();
        }
      }
    }
    
    // Gérer le cas d'un token valide
    async function handleValidToken(authStore: ReturnType<typeof useAuthStore>) {
      console.log('Token valide trouvé, récupération du profil...');
      const profileLoaded = await authStore.fetchUserProfile();
      
      if (!profileLoaded && !import.meta.env.DEV) {
        console.warn('Échec du chargement du profil, déconnexion');
        authStore.logout();
      } else if (!profileLoaded) {
        console.warn('Profil non chargé mais en mode DEV, conservation de la session');
      }
    };
    
    // Ajouter une méthode globale qui peut être appelée après le montage
    app.config.globalProperties.$initAuth = authInit;
    
    // Exposer la méthode d'initialisation
    return { authInit };
  }
}
