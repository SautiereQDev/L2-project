/**
 * Plugin pour l'initialisation de l'authentification
 * Ce plugin charge les données d'authentification au démarrage de l'application
 */
import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '../app/stores/auth.store';

// Plugin Nuxt pour initialiser l'authentification au démarrage
export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp;
  // Fonction d'initialisation de l'auth
  const authInit = async () => {
    const authStore = useAuthStore();
    try {
      console.log('Initialisation de l\'authentification...');
      if (!authStore.token) {
        console.log('Aucun token trouvé, utilisateur non authentifié');
        return;
      }
      if (authStore.isTokenExpired()) {
        console.log('Token expiré, tentative de rafraîchissement...');
        const refreshed = await authStore.refreshTokenIfNeeded();
        if (!refreshed && !import.meta.env.DEV) authStore.logout();
        return;
      }
      console.log('Token valide trouvé, récupération du profil...');
      const profileLoaded = await authStore.fetchUserProfile();
      if (!profileLoaded && !import.meta.env.DEV) authStore.logout();
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'authentification:', error);
      if (!import.meta.env.DEV) useAuthStore().logout();
    }
  };
  // Exposer la fonction au globalProperties
  vueApp.config.globalProperties.$initAuth = authInit;
});
