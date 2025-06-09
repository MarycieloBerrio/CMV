const authRoutes = [
  {
    path: '/',
    component: () => import('../views/LoginPage.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterPage.vue')
  },
]

export default authRoutes
