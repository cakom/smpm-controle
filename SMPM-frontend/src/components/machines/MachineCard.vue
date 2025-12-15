<template>
  <div class="card hover:shadow-xl transition-all cursor-pointer" @click="$emit('view', machine)">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ machine.nome }}</h3>
        <p class="text-sm text-gray-500">{{ machine.tipo }} - {{ machine.setor }}</p>
      </div>
      <span :class="['badge', statusColor]">{{ machine.status }}</span>
    </div>

    <!-- Info -->
    <div class="space-y-2 mb-4 text-sm text-gray-600">
      <p>🏭 {{ machine.fabricante }} - {{ machine.modelo }}</p>
      <p>🔢 S/N: {{ machine.numeroSerie || 'N/A' }}</p>
      <p>📅 Próxima: {{ formatDate(machine.proximaManutencao) }}</p>
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-4 border-t">
      <button @click.stop="$emit('edit', machine)" class="flex-1 btn btn-outline text-sm py-2">
        Editar
      </button>
      <button @click.stop="$emit('schedule', machine)" class="flex-1 btn btn-primary text-sm py-2">
        Agendar
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/helpers'

const props = defineProps({
  machine: { type: Object, required: true }
})

defineEmits(['view', 'edit', 'schedule'])

const statusColor = computed(() => ({
  'Ativa': 'badge-success',
  'Inativa': 'bg-gray-100 text-gray-800',
  'Em Manutenção': 'badge-warning',
  'Aguardando Peças': 'badge-info'
})[props.machine.status] || 'bg-gray-100 text-gray-800')
</script>