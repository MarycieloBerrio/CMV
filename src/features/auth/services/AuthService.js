import axiosInstance from '@/shared/services/authInterceptor'
import { setAuthTokens, removeAuthTokens, hasAuthToken } from '@/shared/services/secureStorage'
import { useNotification } from '@/shared/composables/useNotification'

const { success: showSuccess, error: showError } = useNotification()

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials, {
      withCredentials: true
    })

    const { refreshToken } = response.data
    setAuthTokens(null, refreshToken) // El token principal se maneja con cookies HttpOnly
    showSuccess('Inicio de sesión exitoso')
    return response.data
  } catch (error) {
    showError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
    throw error
  }
}

export const logout = async () => {
  try {
    await axiosInstance.post('/auth/logout', {}, {
      withCredentials: true
    })
    removeAuthTokens()
    showSuccess('Sesión cerrada correctamente')
  } catch (error) {
    showError('Error al cerrar sesión')
    throw error
  }
}

export const isAuthenticated = () => {
  return hasAuthToken()
}

export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me', {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    showError('Error al obtener información del usuario')
    throw error
  }
}
