import Vue from "vue";
import VueRouter from "vue-router";

const loadComponent = path => () => import(`@/views/${path}.vue`);

Vue.use(VueRouter);

const routes = [
  // MAIN PAGE
  {
    path: "/",
    name: "Main",
    component: loadComponent("client/Main"),
    meta: {
      requireAuth: false
    }
  },

  // GENERAL REGISTRATION PAGE
  {
    path: "/registration",
    name: "registration",
    component: loadComponent("login/Registration"),
    meta: {
      requireAuth: false
    }
  }
];

const router = new VueRouter({
  routes
});

export default router;
