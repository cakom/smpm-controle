import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useMachinesStore = defineStore('machines', () => {
  // State
  const machines = ref([])
  const currentMachine = ref(null)
  const loading = ref(false)
  const filters = ref({
    status: '',
    setor: '',
    tipo: '',
    search: ''
  })

  // Actions
  const fetchMachines = async () => {
    loading.value = true
    try {
      const response = await api.machines.getAll(filters.value)
      machines.value = response.data.data
      return response.data
    } catch (error) {
      toast.error('Erro ao carregar máquinas')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchMachineById = async (id) => {
    loading.value = true
    try {
      const response = await api.machines.getById(id)
      currentMachine.value = response.data.data
      return response.data
    } catch (error) {
      toast.error('Erro ao carregar máquina')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createMachine = async (machineData) => {
    loading.value = true
    try {
      const response = await api.machines.create(machineData)
      machines.value.unshift(response.data.data)
      toast.success('Máquina cadastrada com sucesso!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar máquina'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateMachine = async (id, machineData) => {
    loading.value = true
    try {
      const response = await api.machines.update(id, machineData)
      const index = machines.value.findIndex(m => m._id === id)
      if (index !== -1) {
        machines.value[index] = response.data.data
      }
      toast.success('Máquina atualizada com sucesso!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar máquina'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteMachine = async (id) => {
    loading.value = true
    try {
      await api.machines.delete(id)
      machines.value = machines.value.filter(m => m._id !== id)
      toast.success('Máquina deletada com sucesso!')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao deletar máquina'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchMachines()
  }

  const clearFilters = () => {
    filters.value = {
      status: '',
      setor: '',
      tipo: '',
      search: ''
    }
    fetchMachines()
  }

  return {
    machines,
    currentMachine,
    loading,
    filters,
    fetchMachines,
    fetchMachineById,
    createMachine,
    updateMachine,
    deleteMachine,
    setFilters,
    clearFilters
  }
})