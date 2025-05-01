import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/records",
      name: "records",
      component: () => import("../views/RecordsViewNew.vue"),
    },
    {
      path: "/records/:id",
      name: "record-details",
      component: () => import("../views/RecordDetailsView.vue"),
    },
    {
      path: "/athletes",
      name: "athletes",
      component: () => import("../views/HomeView.vue"), // À remplacer par une vue dédiée aux athlètes
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/HomeView.vue"), // À remplacer par une vue À propos
    },
    {
      path: "/contact",
      name: "contact",
      component: () => import("../views/HomeView.vue"), // À remplacer par une vue Contact
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
      meta: {
        requiresAuth: false,
        title: 'Connexion'
      }
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
      meta: {
        requiresAuth: true,
        title: 'Mon Profil'
      }
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/HomeView.vue"), // À remplacer par une vue Inscription
    },
  ],
});

// Navigation Guard pour vérifier l'authentification
router.beforeEach((to, from, next) => {
  // Vérifier si la route nécessite une authentification
  const requiresAuth = to.meta.requiresAuth === true;
  
  // Si l'auth store n'est pas encore disponible, on l'initialise
  // Note: ceci utilise la fonction au lieu du composable directement
  // car les composables Vue ne doivent être utilisés que dans des composants setup
  const authStore = useAuthStore();
  
  // Si la route nécessite une authentification et que l'utilisateur n'est pas connecté
  if (requiresAuth && !authStore.isAuthenticated) {
    // Rediriger vers la page de connexion avec l'URL de retour
    next({ 
      name: 'login',
      query: { redirect: to.fullPath }
    });
  } 
  // Sinon si l'utilisateur est sur la page de connexion mais déjà connecté
  else if (to.name === 'login' && authStore.isAuthenticated) {
    // Rediriger vers la page d'accueil ou la page demandée
    const redirectPath = to.query.redirect as string || '/';
    next(redirectPath);
  }
  // Dans tous les autres cas, on continue la navigation
  else {
    next();
  }
  
  // Mettre à jour le titre de la page
  if (to.meta.title && typeof to.meta.title === 'string') {
    document.title = `${to.meta.title} - Records d'Athlétisme`;
  } else {
    document.title = `Records d'Athlétisme`;
  }
});

export default router;
