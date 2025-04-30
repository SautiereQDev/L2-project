import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vueQueryPlugin from "./plugins/vue-query";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vueQueryPlugin);

app.mount("#app");
