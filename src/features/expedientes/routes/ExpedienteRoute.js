const expedienteRoutes = [
  {
    path: '/expedientes',
    name: 'expedientes',
    component: () => import('../components/views/ExpedientePage.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  },
  {
    path: '/expedientes/:id',
    name: 'expediente-detalle',
    component: () => import('../components/views/ExpedienteDetallePage.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  },
  {
    path: '/expedientes/parametrizacion',
    name: 'expedientes-parametrizacion',
    component: () => import('../components/views/ParametrizacionPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  },
  {
    path: '/expedientes/remision',
    name: 'expedientes-remision',
    component: () => import('../components/views/RemisionPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  }
]

export default expedienteRoutes
