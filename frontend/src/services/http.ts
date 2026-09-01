/**
 * Shared Axios instance for the whole app.
 *
 * - baseURL points at the API, so calls use short paths like '/auth/login'.
 * - Request interceptor: attaches the JWT (from localStorage) as a Bearer
 *   header on EVERY outgoing request — so we never add it by hand.
 * - Response interceptor: if any call returns 401 (expired/invalid token),
 *   it clears the token and redirects to /login (global auto-logout).
 */
import axios from 'axios'

export const http = axios.create({
  // Production: set VITE_API_URL to the deployed API URL (must end in /api).
  // Development: falls back to the local backend.
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
})

// El interceptor corre ANTES de CADA request que salga por `http`:
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})


// Si CUALQUIER response vuelve 401 (token vencido/inválido) → logout + login
http.interceptors.response.use(
  (response) => response,                    // 2xx: pasa normal
  (error) => {
    const isLogin = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLogin) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)             // deja que el catch local también se entere
  }
)