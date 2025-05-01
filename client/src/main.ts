import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vueQueryPlugin from "./plugins/vue-query";
import authInitPlugin from "./plugins/auth-init";
import authErrorsPlugin from "./plugins/auth-errors";
import { setupAuthInterceptor } from "./utils/auth-interceptor";

const app = createApp(App);

// Installer Pinia avant le plugin d'authentification
app.use(createPinia());
app.use(router);
app.use(vueQueryPlugin);
app.use(authInitPlugin);
app.use(authErrorsPlugin);

// Installer l'intercepteur d'authentification pour les requêtes fetch
setupAuthInterceptor();

// Monter l'application une seule fois
const vm = app.mount("#app");

// Initialiser l'authentification après le montage
setTimeout(() => {
  const authPlugin = app.config.globalProperties.$initAuth;
  if (authPlugin) {
    authPlugin();
  }
}, 0);
