import axios from 'axios'

const ADMIN_API = import.meta.env.VITE_ADMIN_API

const apiClient = axios.create({
  baseURL: ADMIN_API,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export async function getUsers() {
  try {
    const users = await apiClient.get('/users')
    return users.data
  } catch (error) {
    throw error
  }
}

let firstAttempt = true

export const getUsersMocked = async () => {
  if (firstAttempt) {
    firstAttempt = false
    throw new Error('Failed to load users: Simulated network error')
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
      ])
    }, 1000)
  })
}
