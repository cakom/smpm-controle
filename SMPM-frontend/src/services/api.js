import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

// Adicionar token em todas requisições
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

// Tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default {
  // Auth
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    me: () => api.get('/auth/me')
  },
  
  // Machines
  machines: {
    getAll: (params) => api.get('/machines', { params }),
    getById: (id) => api.get(`/machines/${id}`),
    create: (data) => api.post('/machines', data),
    update: (id, data) => api.put(`/machines/${id}`, data),
    delete: (id) => api.delete(`/machines/${id}`)
  },
  
  // Maintenances
  maintenances: {
    getAll: (params) => api.get('/maintenances', { params }),
    getById: (id) => api.get(`/maintenances/${id}`),
    create: (data) => api.post('/maintenances', data),
    update: (id, data) => api.put(`/maintenances/${id}`, data),
    delete: (id) => api.delete(`/maintenances/${id}`),
    getKpis: () => api.get('/maintenances/kpis')
  }
}