<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Manutenções</h1>
        <p class="text-gray-600 mt-1">Gerencie todas as manutenções</p>
      </div>
      <button @click="showModal = true" class="mt-4 md:mt-0 btn btn-primary">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nova Manutenção
      </button>
    </div>

    <!-- Filtros -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select v-model="filters.status" class="input" @change="applyFilters">
          <option value="">Todos os status</option>
          <option value="Pendente">Pendente</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluída">Concluída</option>
        </select>
        <select v-model="filters.tipo" class="input" @change="applyFilters">
          <option value="">Todos os tipos</option>
          <option value="Preventiva">Preventiva</option>
          <option value="Corretiva">Corretiva</option>
          <option value="Preditiva">Preditiva</option>
          <option value="Inspeção">Inspeção</option>
        </select>
        <button @click="clearFilters" class="btn btn-outline">
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card bg-yellow-50">
        <p class="text-sm text-gray-600">Pendentes</p>
        <p class="text-2xl font-bold text-yellow-600">{{ stats.pendentes }}</p>
      </div>
      <div class="card bg-blue-50">
        <p class="text-sm text-gray-600">Em Andamento</p>
        <p class="text-2xl font-bold text-blue-600">{{ stats.emAndamento }}</p>
      </div>
      <div class="card bg-green-50">
        <p class="text-sm text-gray-600">Concluídas</p>
        <p class="text-2xl font-bold text-green-600">{{ stats.concluidas }}</p>
      </div>
      <div class="card bg-red-50">
        <p class="text-sm text-gray-600">Atrasadas</p>
        <p class="text-2xl font-bold text-red-600">{{ stats.atrasadas }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600">Carregando...</p>
    </div>

    <!-- Lista -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MaintenanceCard
        v-for="maintenance in maintenances"
        :key="maintenance._id"
        :maintenance="maintenance"
        @view="viewMaintenance"
        @edit="editMaintenance"
        @start="startMaintenance"
        @complete="completeMaintenance"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && maintenances.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="mt-2 text-gray-500">Nenhuma manutenção encontrada</p>
    </div>

    <!-- Modal -->
    <Modal v-model="showModal" :title="editingItem ? 'Editar Manutenção' : 'Nova Manutenção'" size="lg">
      <MaintenanceForm
        :maintenance="editingItem"
        :loading="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMaintenancesStore } from '@/stores/maintenances'
import MaintenanceCard from '@/components/maintenance/MaintenanceCard.vue'
import MaintenanceForm from '@/components/maintenance/MaintenanceForm.vue'
import Modal from '@/components/common/Modal.vue'

const store = useMaintenancesStore()

const showModal = ref(false)
const editingItem = ref(null)
const submitting = ref(false)
const filters = ref({ status: '', tipo: '' })

const loading = computed(() => store.loading)
const maintenances = computed(() => store.maintenances)
const stats = computed(() => ({
  pendentes: maintenances.value.filter(m => m.status === 'Pendente').length,
  emAndamento: maintenances.value.filter(m => m.status === 'Em Andamento').length,
  concluidas: maintenances.value.filter(m => m.status === 'Concluída').length,
  atrasadas: store.overdueMaintenances.length
}))

const applyFilters = () => {
  store.setFilters(filters.value)
}

const clearFilters = () => {
  filters.value = { status: '', tipo: '' }
  store.clearFilters()
}

const viewMaintenance = (item) => {
  console.log('View:', item)
}

const editMaintenance = (item) => {
  editingItem.value = item
  showModal.value = true
}

const startMaintenance = async (item) => {
  try {
    await store.updateMaintenance(item._id, { 
      status: 'Em Andamento',
      dataInicio: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro:', error)
  }
}

const completeMaintenance = async (item) => {
  try {
    await store.updateMaintenance(item._id, { 
      status: 'Concluída',
      dataConclusao: new Date().toISOString()
    })
  } catch (error) {
    console.error('Erro:', error)
  }
}

const handleSubmit = async (data) => {
  submitting.value = true
  try {
    if (editingItem.value) {
      await store.updateMaintenance(editingItem.value._id, data)
    } else {
      await store.createMaintenance(data)
    }
    closeModal()
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showModal.value = false
  editingItem.value = null
}

onMounted(() => {
  store.fetchMaintenances()
})
</script>