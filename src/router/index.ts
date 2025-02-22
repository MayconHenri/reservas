import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"
import Reserva from "@/views/Reservation.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/reserva",
    name: "reserva",
    component: Reserva,
    props: true,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
