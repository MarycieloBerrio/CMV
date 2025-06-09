import axios from 'axios'
import Swal from 'sweetalert2'

const AUTH_API = import.meta.env.VITE_AUTH_API

const apiClient = axios.create({
  baseURL: AUTH_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export function loginMocked(email, password) {
  const token = 'mocked-token'
  return token
}

export async function login(email, password) {
  try {
    const token = await apiClient.post('/login', { email, password })
    return token.data
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Something went wrong!',
    })
  }
}
