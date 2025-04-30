import { createRouter, createWebHistory } from "vue-router";
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
      path: "/records/disciplines",
      name: "records-disciplines",
      component: () => import("../views/RecordsByDisciplineView.vue"),
    },
    {
      path: "/records/categories",
      name: "records-categories",
      component: () => import("../views/RecordsByCategoryView.vue"),
    },
    {
      path: "/records/genres",
      name: "records-genres",
      component: () => import("../views/RecordsByGenreView.vue"),
    },
    {
      path: "/records/search",
      name: "records-search",
      component: () => import("../views/RecordsSearchView.vue"),
    },
    {
      path: "/disciplines/run",
      name: "disciplines-run",
      component: () => import("../views/RecordsByDisciplineView.vue"),
      props: { preselectedType: 'run' }
    },
    {
      path: "/disciplines/jump",
      name: "disciplines-jump",
      component: () => import("../views/RecordsByDisciplineView.vue"),
      props: { preselectedType: 'jump' }
    },
    {
      path: "/disciplines/throw",
      name: "disciplines-throw",
      component: () => import("../views/RecordsByDisciplineView.vue"),
      props: { preselectedType: 'throw' }
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
      component: () => import("../views/HomeView.vue"), // À remplacer par une vue Connexion
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/HomeView.vue"), // À remplacer par une vue Inscription
    },
  ],
});

export default router;
