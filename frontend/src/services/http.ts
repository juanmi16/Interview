import axios from 'axios'

export const http = axios.create({
  baseURL: 'http://localhost:5000/api',   // TODO: confirmar el puerto real del backend
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