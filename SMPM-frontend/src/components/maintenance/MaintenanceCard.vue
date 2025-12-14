<template>
  <div class="card hover:shadow-xl transition-all cursor-pointer" @click="$emit('view', maintenance)">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <span
            :class="[
              'badge',
              typeColor
            ]"
          >
            {{ maintenance.tipo }}
          </span>
          <span
            :class="[
              'badge',
              statusColor
            ]"
          >
            {{ maintenance.status }}
          </span>
          <span
            v-if="maintenance.prioridade"
            :class="[
              'badge',
              priorityColor
            ]"
          >
            {{ maintenance.prioridade }}
          </span>
        </div>
        <h3 class="text-lg font-semibold text-gray-900">
          {{ maintenance.descricao }}
        </h3>
      </div>
    </div>

    <!-- Máquina -->
    <div class="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center text-white font-bold text-sm">
        {{ machineInitials }}
      </div>
      <div>
        <p class="text-sm font-medium text-gray-900">
          {{ maintenance.maquina?.nome || 'Máquina não especificada' }}
        </p>
        <p class="text-xs text-gray-500">
          {{ maintenance.maquina?.setor || '-' }}
        </p>
      </div>
    </div>

    <!-- Informações -->
    <div class="space-y-2 mb-4">
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Agendada: {{ formatDate(maintenance.dataAgendada) }}</span>
      </div>

      <div v-if="maintenance.tecnicoResponsavel" class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ maintenance.tecnicoResponsavel.nome }}</span>
      </div>

      <div v-if="maintenance.custoTotal" class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ formatCurrency(maintenance.custoTotal) }}</span>
      </div>
    </div>

    <!-- Alerta se atrasada -->
    <div v-if="isOverdue" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-center text-sm text-red-800">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="font-medium">Manutenção atrasada!</span>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex gap-2 pt-4 border-t border-gray-100">
      <button
        v-if="maintenance.status === 'Pendente'"
        @click.stop="$emit('start', maintenance)"
        class="flex-1 btn btn-primary text-sm py-2"
      >
        Iniciar
      </button>
      <button
        v-if="maintenance.status === 'Em Andamento'"
        @click.stop="$emit('complete', maintenance)"
        class="flex-1 btn btn-success text-sm py-2"
      >
        Concluir
      </button>
      <button
        @click.stop="$emit('edit', maintenance)"
        class="flex-1 btn btn-outline text-sm py-2"
      >
        Editar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate, formatCurrency, getInitials } from '@/utils/helpers'
import { parseISO, isPast } from 'date-fns'

const props = defineProps({
  maintenance: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'start', 'complete'])

const machineInitials = computed(() => 
  getInitials(props.maintenance.maquina?.nome || 'M')
)

const isOverdue = computed(() => {
  if (props.maintenance.status === 'Concluída' || props.maintenance.status === 'Cancelada') {
    return false
  }
  return isPast(parseISO(props.maintenance.dataAgendada))
})

const statusColor = computed(() => {
  const colors = {
    'Pendente': 'badge-warning',
    'Em Andamento': 'badge-info',
    'Concluída': 'badge-success',
    'Cancelada': 'badge-danger'
  }
  return colors[props.maintenance.status] || 'bg-gray-100 text-gray-800'
})

const typeColor = computed(() => {
  const colors = {
    'Preventiva': 'bg-blue-100 text-blue-800',
    'Corretiva': 'bg-red-100 text-red-800',
    'Preditiva': 'bg-purple-100 text-purple-800',
    'Inspeção': 'bg-green-100 text-green-800'
  }
  return colors[props.maintenance.tipo] || 'bg-gray-100 text-gray-800'
})

const priorityColor = computed(() => {
  const colors = {
    'Baixa': 'bg-gray-100 text-gray-800',
    'Média': 'bg-yellow-100 text-yellow-800',
    'Alta': 'bg-orange-100 text-orange-800',
    'Crítica': 'bg-red-100 text-red-800'
  }
  return colors[props.maintenance.prioridade] || 'bg-gray-100 text-gray-800'
})
</script>