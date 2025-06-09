const adminRoutes = [
  {
    path: '/users',
    component: () => import('../components/views/UserPage.vue'),
    meta: { requiresAuth: true }
  }
]

export default adminRoutes
