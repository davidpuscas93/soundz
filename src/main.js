import { createApp } from "vue";
import { createPinia } from "pinia";
import { registerSW } from "virtual:pwa-register";

import App from "./App.vue";
import router from "./router";

import VeeValidatePlugin from "./plugins/validation";
import GlobalComponents from "./plugins/_globals";

import progressBar from "./includes/progress-bar";
import { auth } from "./includes/firebase";
import i18n from "./includes/i18n";

import Icon from "./directives/icon";

import "nprogress/nprogress.css";
import "./assets/base.css";
import "./assets/main.css";

registerSW({ immediate: true });

progressBar(router);

let app = null;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.use(GlobalComponents);

    app.directive("icon", Icon);

    app.mount("#app");
  }
});
