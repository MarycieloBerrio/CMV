import UserPage from '../components/views/UserPage.vue'

const adminRoutes = [{ path: '/users', component: UserPage, meta: { requiresAuth: true } }]

export default adminRoutes
