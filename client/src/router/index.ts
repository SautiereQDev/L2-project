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
