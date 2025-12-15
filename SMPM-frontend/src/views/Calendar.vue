<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Calendário</h1>
      <p class="text-gray-600 mt-1">Visualize manutenções agendadas</p>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Calendário -->
      <div class="lg:col-span-2">
        <Calendar
          :maintenances="maintenances"
          @day-selected="handleDaySelected"
        />
      </div>

      <!-- Manutenções do dia selecionado -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">
          {{ selectedDateFormatted }}
        </h3>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>

        <div v-else-if="selectedDayMaintenances.length === 0" class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">
            Nenhuma manutenção agendada
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="maintenance in selectedDayMaintenances"
            :key="maintenance._id"
            class="p-3 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
            @click="viewMaintenance(maintenance)"
          >
            <div class="flex items-center gap-2 mb-1">
              <span :class="['badge text-xs', getTypeColor(maintenance.tipo)]">
                {{ maintenance.tipo }}
              </span>
              <span :class="['badge text-xs', getStatusColor(maintenance.status)]">
                {{ maintenance.status }}
              </span>
            </div>
            <h4 class="font-medium text-sm text-gray-900">
              {{ maintenance.maquina?.nome }}
            </h4>
            <p class="text-xs text-gray-600 mt-1">
              {{ formatDateTime(maintenance.dataAgendada) }}
            </p>
          </div>
        </div>

        <div class="mt-6">
          <router-link to="/maintenances" class="btn btn-primary w-full text-sm">
            Ver todas as manutenções
          </router-link>
        </div>
      </div>
    </div>

    <!-- Próximas manutenções -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">Próximos 7 dias</h3>
      
      <div class="space-y-3">
        <div
          v-for="maintenance in upcomingMaintenances"
          :key="maintenance._id"
          class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
          @click="viewMaintenance(maintenance)"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span :class="['badge text-xs', getTypeColor(maintenance.tipo)]">
                {{ maintenance.tipo }}
              </span>
              <span :class="['badge text-xs', getPriorityColor(maintenance.prioridade)]">
                {{ maintenance.prioridade }}
              </span>
            </div>
            <h4 class="font-medium text-gray-900">
              {{ maintenance.maquina?.nome }}
            </h4>
            <p class="text-sm text-gray-600 mt-1">
              {{ maintenance.descricao }}
            </p>
          </div>
          <div class="text-right ml-4">
            <p class="text-sm font-medium text-gray-900">
              {{ formatDate(maintenance.dataAgendada) }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              {{ formatTime(maintenance.dataAgendada) }}
            </p>
          </div>
        </div>

        <div v-if="upcomingMaintenances.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">
            Nenhuma manutenção nos próximos 7 dias
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenancesStore } from '@/stores/maintenances'
import { format, isSameDay, addDays, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { formatDate, formatDateTime } from '@/utils/helpers'
import Calendar from '@/components/maintenance/Calendar.vue'

const router = useRouter()
const store = useMaintenancesStore()

const selectedDate = ref(new Date())
const loading = computed(() => store.loading)
const maintenances = computed(() => store.maintenances)

const selectedDateFormatted = computed(() => {
  return format(selectedDate.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
})

const selectedDayMaintenances = computed(() => {
  return maintenances.value.filter(m => 
    isSameDay(new Date(m.dataAgendada), selectedDate.value)
  )
})

const upcomingMaintenances = computed(() => {
  const today = new Date()
  const nextWeek = addDays(today, 7)
  
  return maintenances.value
    .filter(m => {
      const maintenanceDate = new Date(m.dataAgendada)
      return isWithinInterval(maintenanceDate, { start: today, end: nextWeek })
    })
    .sort((a, b) => new Date(a.dataAgendada) - new Date(b.dataAgendada))
    .slice(0, 10)
})

const handleDaySelected = (date) => {
  selectedDate.value = date
}

const viewMaintenance = (maintenance) => {
  router.push(`/maintenances?id=${maintenance._id}`)
}

const formatTime = (date) => {
  return format(new Date(date), 'HH:mm', { locale: ptBR })
}

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

onMounted(() => {
  store.fetchMaintenances()
})
</script>
