import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

// Criar instância do axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor de requisição - adicionar token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta - tratar erros
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      const status = error.response.status
      
      if (status === 401) {
        // Token inválido ou expirado
        const authStore = useAuthStore()
        authStore.logout()
        router.push('/login')
      } else if (status === 403) {
        // Sem permissão
        console.error('Acesso negado')
      } else if (status === 404) {
        // Não encontrado
        console.error('Recurso não encontrado')
      } else if (status >= 500) {
        // Erro do servidor
        console.error('Erro no servidor')
      }
    } else if (error.request) {
      // Requisição feita mas sem resposta
      console.error('Servidor não responde')
    } else {
      // Erro ao configurar requisição
      console.error('Erro na requisição:', error.message)
    }
    
    return Promise.reject(error)
  }
)

// Exportar métodos
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
    getKpis: () => api.get('/maintenances/kpis'),
    getMachineHistory: (machineId) => api.get(`/maintenances/machine/${machineId}`)
  }
}