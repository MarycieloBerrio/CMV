import axios from 'axios'
import { getRefreshToken, removeAuthTokens } from './secureStorage'
import { useNotification } from '../composables/useNotification'

const { error: showError } = useNotification()

// URL base de la API
const API_URL = import.meta.env.VITE_API_URL

// Instancia de axios para el interceptor
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true // Importante para manejar cookies HttpOnly
})

// Flag para evitar múltiples llamadas de refresh
let isRefreshing = false
// Cola de peticiones fallidas que se reintentarán después del refresh
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor para peticiones
axiosInstance.interceptors.request.use(
  config => {
    // No necesitamos agregar el token manualmente ya que se maneja con cookies HttpOnly
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Si el error es 401 y no es una petición de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya hay un refresh en proceso, encolamos la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return axiosInstance(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Llamada al endpoint de refresh
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken
        }, {
          withCredentials: true
        })

        // El nuevo token se maneja automáticamente por la cookie HttpOnly
        processQueue(null, response.data.token)
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
        removeAuthTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
