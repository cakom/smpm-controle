import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

export const useMaintenancesStore = defineStore('maintenances', () => {
  const toast = useToast()
  
  const maintenances = ref([])
  const kpis = ref(null)
  const loading = ref(false)

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
  const fetchMaintenances = async (filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.maintenances.getAll(filters)
      maintenances.value = data.data || data
    } catch (error) {
      toast.error('Erro ao carregar manutenções')
    } finally {
      loading.value = false
    }
  }

  const createMaintenance = async (data) => {
    loading.value = true
    try {
      const response = await api.maintenances.create(data)
      maintenances.value.unshift(response.data.data)
      toast.success('Manutenção cadastrada!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar')
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateMaintenance = async (id, data) => {
    loading.value = true
    try {
      const response = await api.maintenances.update(id, data)
      const idx = maintenances.value.findIndex(m => m._id === id)
      if (idx !== -1) maintenances.value[idx] = response.data.data
      toast.success('Manutenção atualizada!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao atualizar')
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
      toast.success('Manutenção deletada!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao deletar')
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchKpis = async () => {
    try {
      const { data } = await api.maintenances.getKpis()
      kpis.value = data.data
    } catch (error) {
      console.error('Erro ao carregar KPIs:', error)
    }
  }

  return {
    maintenances, kpis, loading,
    pendingMaintenances, overdueMaintenances,
    fetchMaintenances, createMaintenance, updateMaintenance, deleteMaintenance, fetchKpis
  }
})