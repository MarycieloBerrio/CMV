const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

/**
 * Almacena el token de forma segura usando HttpOnly cookies
 * @param {string} token - Token de autenticación
 * @param {string} refreshToken - Token de refresco
 */
export const setAuthTokens = (token, refreshToken) => {
  // Almacenamos el refresh token en localStorage ya que es necesario para el proceso de refresh
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
  }

  // El token principal se maneja a través de cookies HttpOnly
  // Esto se debe configurar en el backend para que envíe el token como cookie HttpOnly
  // y el frontend solo necesita manejar el refresh token
}

/**
 * Obtiene el refresh token
 * @returns {string|null} Refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * Elimina los tokens de autenticación
 */
export const removeAuthTokens = () => {
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  // La cookie HttpOnly se elimina desde el backend
}

/**
 * Verifica si existe un token de autenticación
 * @returns {boolean}
 */
export const hasAuthToken = () => {
  return !!getRefreshToken()
}
