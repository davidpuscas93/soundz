import { createRouter, createWebHistory } from "vue-router";

import useUserStore from "@/stores/user";

const HomeView = () => import("@/views/HomeView.vue");
const AboutView = () => import("@/views/AboutView.vue");
const ManageView = () => import("@/views/ManageView.vue");
const SongView = () => import("@/views/SongView.vue");

const routes = [
  {
    name: "Home",
    path: "/",
    component: HomeView,
  },
  {
    name: "About",
    path: "/about",
    component: AboutView,
  },
  {
    name: "Manage",
    // alias: "/manage-music",
    path: "/manage",
    component: ManageView,
    beforeEnter: (to, from, next) => {
      console.log("Manage Route Guard");
      next();
    },
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/manage-music",
    redirect: { name: "Manage" },
  },
  {
    name: "Song",
    path: "/song/:id",
    component: SongView,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "Home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
    return;
  }

  const userStore = useUserStore();

  if (userStore.userLoggedIn) {
    next();
  } else {
    next({ name: "Home" });
  }
});

export default router;
