import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

export const useMachinesStore = defineStore('machines', () => {
  const toast = useToast()
  
  const machines = ref([])
  const loading = ref(false)

  const fetchMachines = async (filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.machines.getAll(filters)
      machines.value = data.data || data
    } catch (error) {
      toast.error('Erro ao carregar máquinas')
    } finally {
      loading.value = false
    }
  }

  const createMachine = async (machineData) => {
    loading.value = true
    try {
      const { data } = await api.machines.create(machineData)
      machines.value.unshift(data.data)
      toast.success('Máquina cadastrada!')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar')
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateMachine = async (id, machineData) => {
    loading.value = true
    try {
      const { data } = await api.machines.update(id, machineData)
      const idx = machines.value.findIndex(m => m._id === id)
      if (idx !== -1) machines.value[idx] = data.data
      toast.success('Máquina atualizada!')
      return data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar')
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
      toast.success('Máquina deletada!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao deletar')
      throw error
    } finally {
      loading.value = false
    }
  }

  return { machines, loading, fetchMachines, createMachine, updateMachine, deleteMachine }
})