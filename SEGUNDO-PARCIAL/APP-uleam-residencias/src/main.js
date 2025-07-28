import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import Login from "./components/Login.vue"
import Register from "./components/Register.vue"
import StudentDashboard from "./components/StudentDashboard.vue"
import AdminDashboard from "./components/AdminDashboard.vue"

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register },
  { path: "/student-dashboard", component: StudentDashboard },
  { path: "/admin-dashboard", component: AdminDashboard },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegación simplificado
router.beforeEach((to, from, next) => {
  const user = JSON.parse(sessionStorage.getItem("currentUser") || "null")
  const protectedRoutes = ["/student-dashboard", "/admin-dashboard"]

  if (protectedRoutes.includes(to.path)) {
    if (!user) return next("/")
    if (to.path.includes("student") && user.type !== "student") return next("/")
    if (to.path.includes("admin") && user.type !== "admin") return next("/")
  }
  next()
})

createApp(App).use(router).mount("#app")