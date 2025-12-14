import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useMaintenancesStore = defineStore('maintenances', () => {
  // State
  const maintenances = ref([])
  const currentMaintenance = ref(null)
  const kpis = ref(null)
  const loading = ref(false)
  const filters = ref({
    maquina: '',
    status: '',
    tipo: '',
    dataInicio: '',
    dataFim: ''
  })

  // Getters
  const pendingMaintenances = computed(() => 
    maintenances.value.filter(m => m.status === 'Pendente')
  )
  
  const overdueMaintenances = computed(() => 
    maintenances.value.filter(m => 
      m.status === 'Pendente' && new Date(m.dataAgendada) < new Date()
    )
  )

  // Actions
  const fetchMaintenances = async () => {
    loading.value = true
    try {
      const response = await api.maintenances.getAll(filters.value)
      maintenances.value = response.data.data
      return response.data
    } catch (error) {
      toast.error('Erro ao carregar manutenções')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchMaintenanceById = async (id) => {
    loading.value = true
    try {
      const response = await api.maintenances.getById(id)
      currentMaintenance.value = response.data.data
      return response.data
    } catch (error) {
      toast.error('Erro ao carregar manutenção')
      throw error
    } finally {
      loading.value = false
    }
  }

  const createMaintenance = async (maintenanceData) => {
    loading.value = true
    try {
      const response = await api.maintenances.create(maintenanceData)
      maintenances.value.unshift(response.data.data)
      toast.success('Manutenção cadastrada com sucesso!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao cadastrar manutenção'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateMaintenance = async (id, maintenanceData) => {
    loading.value = true
    try {
      const response = await api.maintenances.update(id, maintenanceData)
      const index = maintenances.value.findIndex(m => m._id === id)
      if (index !== -1) {
        maintenances.value[index] = response.data.data
      }
      toast.success('Manutenção atualizada com sucesso!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao atualizar manutenção'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteMaintenance = async (id) => {
    loading.value = true
    try {
      await api.maintenances.delete(id)
      maintenances.value = maintenances.value.filter(m => m._id !== id)
      toast.success('Manutenção deletada com sucesso!')
    } catch (error) {
      const message = error.response?.data?.message || 'Erro ao deletar manutenção'
      toast.error(message)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchKpis = async () => {
    loading.value = true
    try {
      const response = await api.maintenances.getKpis()
      kpis.value = response.data.data
      return response.data
    } catch (error) {
      toast.error('Erro ao carregar KPIs')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchMachineHistory = async (machineId) => {
    loading.value = true
    try {
      const response = await api.maintenances.getMachineHistory(machineId)
      return response.data.data
    } catch (error) {
      toast.error('Erro ao carregar histórico')
      throw error
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    fetchMaintenances()
  }

  const clearFilters = () => {
    filters.value = {
      maquina: '',
      status: '',
      tipo: '',
      dataInicio: '',
      dataFim: ''
    }
    fetchMaintenances()
  }

  return {
    maintenances,
    currentMaintenance,
    kpis,
    loading,
    filters,
    pendingMaintenances,
    overdueMaintenances,
    fetchMaintenances,
    fetchMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    fetchKpis,
    fetchMachineHistory,
    setFilters,
    clearFilters
  }
})