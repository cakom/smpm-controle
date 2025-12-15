<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Máquina</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="maintenance in maintenances" :key="maintenance._id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ maintenance.maquina?.nome || 'N/A' }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['badge', getTypeColor(maintenance.tipo)]">
              {{ maintenance.tipo }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['badge', getStatusColor(maintenance.status)]">
              {{ maintenance.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="['badge', getPriorityColor(maintenance.prioridade)]">
              {{ maintenance.prioridade }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(maintenance.dataAgendada) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <div class="flex justify-end gap-2">
              <button @click="$emit('view', maintenance)" class="text-blue-600 hover:text-blue-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button @click="$emit('edit', maintenance)" class="text-green-600 hover:text-green-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="$emit('delete', maintenance)" class="text-red-600 hover:text-red-900">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="maintenances.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="mt-2 text-sm text-gray-500">Nenhuma manutenção encontrada</p>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/helpers'

defineProps({
  maintenances: {
    type: Array,
    required: true
  }
})

defineEmits(['view', 'edit', 'delete'])

const getStatusColor = (status) => {
  const colors = {
    'Pendente': 'badge-warning',
    'Em Andamento': 'badge-info',
    'Concluída': 'badge-success',
    'Cancelada': 'badge-danger'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getTypeColor = (tipo) => {
  const colors = {
    'Preventiva': 'bg-blue-100 text-blue-800',
    'Corretiva': 'bg-red-100 text-red-800',
    'Preditiva': 'bg-purple-100 text-purple-800',
    'Inspeção': 'bg-green-100 text-green-800'
  }
  return colors[tipo] || 'bg-gray-100 text-gray-800'
}

const getPriorityColor = (prioridade) => {
  const colors = {
    'Baixa': 'bg-gray-100 text-gray-800',
    'Média': 'bg-yellow-100 text-yellow-800',
    'Alta': 'bg-orange-100 text-orange-800',
    'Crítica': 'bg-red-100 text-red-800'
  }
  return colors[prioridade] || 'bg-gray-100 text-gray-800'
}
</script>
