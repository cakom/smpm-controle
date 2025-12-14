<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Máquinas</h1>
        <p class="text-gray-600 mt-1">Gerenciamento de máquinas e equipamentos</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="mt-4 md:mt-0 btn btn-primary"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Nova Máquina
      </button>
    </div>

    <!-- Filtros -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Pesquisar..."
          class="input"
          @input="handleSearch"
        />
        <select v-model="filters.status" class="input" @change="applyFilters">
          <option value="">Todos os status</option>
          <option v-for="(status, key) in MACHINE_STATUS" :key="key" :value="status.value">
            {{ status.label }}
          </option>
        </select>
        <select v-model="filters.tipo" class="input" @change="applyFilters">
          <option value="">Todos os tipos</option>
          <option v-for="tipo in MACHINE_TYPES" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
        <button @click="clearFilters" class="btn btn-outline">
          Limpar Filtros
        </button>
      </div>
    </div>

    <!-- View Toggle -->
    <div class="flex justify-between items-center">
      <p class="text-sm text-gray-600">
        {{ machines.length }} máquina(s) encontrada(s)
      </p>
      <div class="flex gap-2">
        <button
          @click="viewMode = 'grid'"
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          @click="viewMode = 'table'"
          :class="[
            'p-2 rounded-lg transition-colors',
            viewMode === 'table' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="card">
          <div class="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MachineCard
        v-for="machine in machines"
        :key="machine._id"
        :machine="machine"
        @view="viewMachine"
        @edit="editMachine"
        @schedule="scheduleMaintenance"
      />
    </div>

    <!-- Table View -->
    <div v-else class="card">
      <MachineTable
        :machines="machines"
        @view="viewMachine"
        @edit="editMachine"
        @delete="confirmDelete"
      />
    </div>

    <!-- Modal Create/Edit -->
    <Modal
      v-model="showCreateModal"
      :title="editingMachine ? 'Editar Máquina' : 'Nova Máquina'"
      size="lg"
    >
      <MachineForm
        :machine="editingMachine"
        :loading="submitting"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </Modal>

    <!-- Modal View -->
    <Modal
      v-model="showViewModal"
      title="Detalhes da Máquina"
      size="lg"
    >
      <div v-if="selectedMachine" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Nome</p>
            <p class="font-medium">{{ selectedMachine.nome }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Tipo</p>
            <p class="font-medium">{{ selectedMachine.tipo }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Setor</p>
            <p class="font-medium">{{ selectedMachine.setor }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span :class="['badge', getStatusColor(selectedMachine.status)]">
              {{ selectedMachine.status }}
            </span>
          </div>
        </div>
        <hr />
        <div>
          <h3 class="font-semibold mb-2">Observações</h3>
          <p class="text-gray-600">{{ selectedMachine.observacoes || 'Nenhuma observação' }}</p>
        </div>
      </div>
      <template #footer>
        <button @click="showViewModal = false" class="btn btn-outline">
          Fechar
        </button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMachinesStore } from '@/stores/machines'
import { MACHINE_STATUS, MACHINE_TYPES } from '@/utils/constants'
import { debounce } from '@/utils/helpers'
import MachineCard from '@/components/machines/MachineCard.vue'
import MachineTable from '@/components/machines/MachineTable.vue'
import MachineForm from '@/components/machines/MachineForm.vue'
import Modal from '@/components/common/Modal.vue'

const router = useRouter()
const machinesStore = useMachinesStore()

const viewMode = ref('grid')
const showCreateModal = ref(false)
const showViewModal = ref(false)
const editingMachine = ref(null)
const selectedMachine = ref(null)
const submitting = ref(false)

const filters = ref({
  search: '',
  status: '',
  tipo: ''
})

const loading = computed(() => machinesStore.loading)
const machines = computed(() => machinesStore.machines)

const handleSearch = debounce(() => {
  applyFilters()
}, 300)

const applyFilters = () => {
  machinesStore.setFilters(filters.value)
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    tipo: ''
  }
  machinesStore.clearFilters()
}

const viewMachine = (machine) => {
  selectedMachine.value = machine
  showViewModal.value = true
}

const editMachine = (machine) => {
  editingMachine.value = machine
  showCreateModal.value = true
}

const scheduleMaintenance = (machine) => {
  router.push({
    path: '/maintenances',
    query: { machine: machine._id }
  })
}

const handleSubmit = async (data) => {
  submitting.value = true
  try {
    if (editingMachine.value) {
      await machinesStore.updateMachine(editingMachine.value._id, data)
    } else {
      await machinesStore.createMachine(data)
    }
    closeModal()
  } catch (error) {
    console.error('Erro ao salvar máquina:', error)
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (machine) => {
  if (confirm(`Tem certeza que deseja excluir a máquina "${machine.nome}"?`)) {
    try {
      await machinesStore.deleteMachine(machine._id)
    } catch (error) {
      console.error('Erro ao excluir máquina:', error)
    }
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingMachine.value = null
}

const getStatusColor = (status) => {
  const colors = {
    'Ativa': 'badge-success',
    'Inativa': 'bg-gray-100 text-gray-800',
    'Em Manutenção': 'badge-warning',
    'Aguardando Peças': 'badge-info'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  machinesStore.fetchMachines()
})
</script>