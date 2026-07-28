import Vue from "vue";
import VueRouter from "vue-router";

import PosView from "@/views/PosView.vue";
import SalesHistoryView from "@/views/SalesHistoryView.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/pos"
  },
  {
    path: "/pos",
    name: "pos",
    component: PosView
  },
  {
    path: "/ventas",
    name: "sales-history",
    component: SalesHistoryView
  },
  {
    path: "*",
    redirect: "/pos"
  }
];

const router = new VueRouter({
  mode: "hash",
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    };
  }
});

export default router;