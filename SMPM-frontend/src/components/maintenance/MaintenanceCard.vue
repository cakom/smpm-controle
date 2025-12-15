<template>
  <div class="card hover:shadow-xl transition-all cursor-pointer" @click="$emit('view', maintenance)">
    <!-- Badges -->
    <div class="flex flex-wrap gap-2 mb-3">
      <span :class="['badge', typeColor]">{{ maintenance.tipo }}</span>
      <span :class="['badge', statusColor]">{{ maintenance.status }}</span>
      <span :class="['badge', priorityColor]">{{ maintenance.prioridade }}</span>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ maintenance.descricao }}</h3>

    <!-- Machine -->
    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
      <div class="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
        {{ machineInitials }}
      </div>
      <div>
        <p class="text-sm font-medium">{{ maintenance.maquina?.nome || 'N/A' }}</p>
        <p class="text-xs text-gray-500">{{ maintenance.maquina?.setor || '-' }}</p>
      </div>
    </div>

    <!-- Info -->
    <p class="text-sm text-gray-600 mb-4">
      📅 {{ formatDate(maintenance.dataAgendada) }}
    </p>

    <!-- Actions -->
    <div class="flex gap-2 pt-4 border-t">
      <button v-if="maintenance.status === 'Pendente'" @click.stop="$emit('start', maintenance)" 
              class="flex-1 btn btn-primary text-sm py-2">
        Iniciar
      </button>
      <button v-if="maintenance.status === 'Em Andamento'" @click.stop="$emit('complete', maintenance)" 
              class="flex-1 btn btn-success text-sm py-2">
        Concluir
      </button>
      <button @click.stop="$emit('edit', maintenance)" class="flex-1 btn btn-outline text-sm py-2">
        Editar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, getInitials } from '@/utils/helpers'

const props = defineProps({
  maintenance: { type: Object, required: true }
})

defineEmits(['view', 'edit', 'start', 'complete'])

const machineInitials = computed(() => getInitials(props.maintenance.maquina?.nome || 'M'))

const statusColor = computed(() => ({
  'Pendente': 'badge-warning',
  'Em Andamento': 'badge-info',
  'Concluída': 'badge-success',
  'Cancelada': 'badge-danger'
})[props.maintenance.status] || 'bg-gray-100 text-gray-800')

const typeColor = computed(() => ({
  'Preventiva': 'bg-blue-100 text-blue-800',
  'Corretiva': 'bg-red-100 text-red-800',
  'Preditiva': 'bg-purple-100 text-purple-800',
  'Inspeção': 'bg-green-100 text-green-800'
})[props.maintenance.tipo] || 'bg-gray-100 text-gray-800')

const priorityColor = computed(() => ({
  'Baixa': 'bg-gray-100 text-gray-800',
  'Média': 'bg-yellow-100 text-yellow-800',
  'Alta': 'bg-orange-100 text-orange-800',
  'Crítica': 'bg-red-100 text-red-800'
})[props.maintenance.prioridade] || 'bg-gray-100 text-gray-800')
</script>