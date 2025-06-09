import RegisterPage from '../views/RegisterPage.vue'
import LoginPage from '../views/LoginPage.vue'

const authRoutes = [
  { path: '/', component: LoginPage },
  { path: '/register', component: RegisterPage },
]

export default authRoutes
