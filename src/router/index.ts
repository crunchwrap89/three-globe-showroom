import { createRouter, createWebHistory } from "vue-router";
import SceneOneView from "../views/SceneOneView.vue";
import SceneTwoView from "../views/SceneTwoView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "SceneOneView",
      component: SceneOneView,
    },
    {
      path: "/two",
      name: "SceneTwoView",
      component: SceneTwoView,
    },
  ],
});

export default router;
