import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'
import authRoutes from '@/features/auth/routes/AuthRoute'
import adminRoutes from '@/features/admin/routes/AdminRoute'
import expedienteRoutes from '@/features/expedientes/routes/ExpedienteRoute'

const routes = [...authRoutes, ...adminRoutes, ...expedienteRoutes]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const store = useStore()
  next()
 //if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
   // next('/')
 // } else {
  // next()
 // }
})

export default router
