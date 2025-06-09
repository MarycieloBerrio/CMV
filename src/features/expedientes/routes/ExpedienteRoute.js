import ExpedientePage from '../components/views/ExpedientePage.vue'
import ExpedienteDetallePage from '../components/views/ExpedienteDetallePage.vue'
import ParametrizacionPage from '../components/views/ParametrizacionPage.vue'
import RemisionPage from "../components/views/RemisionPage.vue"

const expedienteRoutes = [
  {
    path: '/expedientes',
    name: 'expedientes',
    component: ExpedientePage,
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  },
  {
    path: '/expedientes/:id',
    name: 'expediente-detalle',
    component: ExpedienteDetallePage,
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  },
  {
    path: '/expedientes/parametrizacion',
    name: 'expedientes-parametrizacion',
    component: ParametrizacionPage,
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  },
  {
    path: '/expedientes/remision',
    name: 'expedientes-remision',
    component: RemisionPage,
    meta: {
      requiresAuth: true,
      permissions: ['view_expedientes']
    }
  }
]

export default expedienteRoutes