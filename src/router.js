import Vue from "vue";
import Router from "vue-router";
import Main from "./views/Main.vue";
import Cart from "@/views/Cart";

Vue.use(Router);

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "main",
      component: Main
    },
    {
      path: "/cart",
      name: "cart",
      component: Cart
    }
  ]
});
