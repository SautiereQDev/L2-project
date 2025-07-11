/**
 * Plugin d'authentification unifié
 * Gère l'initialisation de l'auth et les erreurs d'authentification globalement
 */
import { createApp, defineComponent, h, ref } from "vue";
import { defineNuxtPlugin } from "#app";
import AuthErrorNotification from "../app/components/AuthErrorNotification.vue";
import type { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth.store";

// État global pour les notifications d'erreur d'authentification
const authErrorState = {
  visible: ref(false),
  message: ref(""),
  title: ref(""),
  lastShownTime: 0,
};

// Minimum time between auth error notifications (in milliseconds)
const MIN_ERROR_NOTIFICATION_INTERVAL = 5000;

/**
 * Gestionnaire global des erreurs d'authentification
 * @param error L'erreur à traiter
 * @param router Instance du router Vue
 * @returns true si l'erreur a été traitée, false sinon
 */
export function handleAuthError(
  error: any,
  router?: ReturnType<typeof useRouter>,
): boolean {
  // Vérifier si c'est une erreur d'authentification
  const isAuthError =
    error?.name === "AuthError" ||
    error?.response?.status === 401 ||
    (error?.message &&
      (error.message.includes("token") ||
        error.message.includes("authentifi") ||
        error.message.includes("session") ||
        error.message.includes("expiré") ||
        error.message.includes("unauthorized") ||
        error.message.includes("unauthenticated")));

  if (!isAuthError) return false;

  // Éviter de spammer les notifications
  const now = Date.now();
  if (now - authErrorState.lastShownTime < MIN_ERROR_NOTIFICATION_INTERVAL) {
    console.log("Auth error notification skipped (rate limiting)");
    return true;
  }

  // Mettre à jour l'état de la notification
  authErrorState.title.value = "Session expirée";
  authErrorState.message.value =
    error?.message ?? "Votre session a expiré. Veuillez vous reconnecter.";
  authErrorState.visible.value = true;
  authErrorState.lastShownTime = now;

  // Si un router est fourni, rediriger vers la page de connexion
  if (router) {
    const currentRoute = router.currentRoute.value;

    // Ne rediriger que si on n'est pas déjà sur la page de login
    if (currentRoute.name !== "login") {
      // Déconnexion
      const authStore = useAuthStore();
      authStore.logout();

      // Rediriger vers la page de connexion avec l'URL actuelle comme redirect
      router.push({
        name: "login",
        query: { redirect: currentRoute.fullPath },
      });
    }
  }

  return true;
}

// Composant racine pour les notifications d'erreur d'authentification
const AuthErrorContainer = defineComponent({
  name: "AuthErrorContainer",
  setup() {
    const dismiss = () => {
      authErrorState.visible.value = false;
    };

    return () =>
      h(AuthErrorNotification, {
        title: authErrorState.title.value,
        message: authErrorState.message.value,
        visible: authErrorState.visible.value,
        duration: 5000,
        onDismiss: dismiss,
      });
  },
});

/**
 * Fonction d'initialisation de l'authentification
 */
async function initAuth() {
  const authStore = useAuthStore();
  try {
    console.log("Initialisation de l'authentification...");
    if (!authStore.token) {
      console.log("Aucun token trouvé, utilisateur non authentifié");
      return;
    }
    if (authStore.isTokenExpired()) {
      console.log("Token expiré, tentative de rafraîchissement...");
      const refreshed = await authStore.refreshTokenIfNeeded();
      if (!refreshed && !import.meta.env.DEV) authStore.logout();
      return;
    }
    console.log("Token valide trouvé, récupération du profil...");
    const profileLoaded = await authStore.fetchUserProfile();
    if (!profileLoaded && !import.meta.env.DEV) authStore.logout();
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de l'authentification:",
      error,
    );
    if (!import.meta.env.DEV) useAuthStore().logout();
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const { vueApp } = nuxtApp;

  // Exposer la fonction d'initialisation de l'auth
  vueApp.config.globalProperties.$initAuth = initAuth;

  // Ne pas exécuter la partie client côté serveur
  if (import.meta.client) {
    // Monter le conteneur de notification
    const errorContainer = document.createElement("div");
    errorContainer.id = "auth-error-container";
    document.body.appendChild(errorContainer);

    // Créer et monter l'application de notification
    const notificationApp = createApp(AuthErrorContainer);
    notificationApp.mount(errorContainer);

    // Ajouter le gestionnaire global des erreurs
    vueApp.config.globalProperties.$handleAuthError = handleAuthError;

    // Exposer une fonction pour montrer les erreurs d'authentification
    vueApp.config.globalProperties.$showAuthError = (
      message: string,
      title: string = "Erreur d'authentification",
    ) => {
      authErrorState.title.value = title;
      authErrorState.message.value = message;
      authErrorState.visible.value = true;
      authErrorState.lastShownTime = Date.now();
    };

    // Installer un gestionnaire d'erreurs global
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;
      if (handleAuthError(error)) {
        event.preventDefault();
      }
    });
  }
});
