<template>
  <div class="card hover:shadow-xl transition-all cursor-pointer group" @click="$emit('view', machine)">
    <!-- Header com Status -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {{ machine.nome }}
        </h3>
        <p class="text-sm text-gray-500">{{ machine.tipo }} - {{ machine.setor }}</p>
      </div>
      <span
        :class="[
          'badge',
          statusColor
        ]"
      >
        {{ machine.status }}
      </span>
    </div>

    <!-- Informações -->
    <div class="space-y-2 mb-4">
      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <span>{{ machine.fabricante }} - {{ machine.modelo }}</span>
      </div>

      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        <span>S/N: {{ machine.numeroSerie || 'Não informado' }}</span>
      </div>

      <div class="flex items-center text-sm text-gray-600">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Próxima manutenção: {{ formatDate(machine.proximaManutencao) }}</span>
      </div>
    </div>

    <!-- Barra de progresso para próxima manutenção -->
    <div class="mb-4">
      <div class="flex justify-between text-xs text-gray-600 mb-1">
        <span>Dias até manutenção</span>
        <span class="font-semibold">{{ daysUntilMaintenance }} dias</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          :class="[
            'h-2 rounded-full transition-all',
            progressColor
          ]"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Ações -->
    <div class="flex gap-2 pt-4 border-t border-gray-100">
      <button
        @click.stop="$emit('edit', machine)"
        class="flex-1 btn btn-outline text-sm py-2"
      >
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Editar
      </button>
      <button
        @click.stop="$emit('schedule', machine)"
        class="flex-1 btn btn-primary text-sm py-2"
      >
        <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Agendar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/helpers'
import { differenceInDays, parseISO } from 'date-fns'

const props = defineProps({
  machine: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'edit', 'schedule'])

const statusColor = computed(() => {
  const colors = {
    'Ativa': 'badge-success',
    'Inativa': 'bg-gray-100 text-gray-800',
    'Em Manutenção': 'badge-warning',
    'Aguardando Peças': 'badge-info'
  }
  return colors[props.machine.status] || 'bg-gray-100 text-gray-800'
})

const daysUntilMaintenance = computed(() => {
  if (!props.machine.proximaManutencao) return 0
  const days = differenceInDays(
    parseISO(props.machine.proximaManutencao),
    new Date()
  )
  return Math.max(0, days)
})

const progressPercentage = computed(() => {
  const days = daysUntilMaintenance.value
  const frequency = props.machine.frequenciaManutencao || 30
  const percentage = ((frequency - days) / frequency) * 100
  return Math.min(100, Math.max(0, percentage))
})

const progressColor = computed(() => {
  const days = daysUntilMaintenance.value
  if (days <= 7) return 'bg-red-500'
  if (days <= 15) return 'bg-yellow-500'
  return 'bg-green-500'
})
</script>
