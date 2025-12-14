import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isTecnico = computed(() => userRole.value === 'tecnico' || isAdmin.value)

  // Actions
  const register = async (userData) => {
    loading.value = true
    try {
      const response = await api.auth.register(userData)
      
      user.value = response.data.data
      token.value = response.data.data.token
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      toast.success('Cadastro realizado com sucesso!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const login = async (credentials) => {
    loading.value = true
    try {
      const response = await api.auth.login(credentials)
      
      user.value = response.data.data
      token.value = response.data.data.token
      
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      
      toast.success(`Bem-vindo(a), ${user.value.nome}!`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao fazer login'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    toast.info('Você saiu do sistema')
  }

  const fetchUser = async () => {
    if (!token.value) return
    
    loading.value = true
    try {
      const response = await api.auth.me()
      user.value = response.data.data
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (error) {
      logout()
    } finally {
      loading.value = false
    }
  }

  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
    if (token.value) {
      fetchUser()
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userRole,
    isAdmin,
    isTecnico,
    register,
    login,
    logout,
    fetchUser,
    initAuth
  }
})