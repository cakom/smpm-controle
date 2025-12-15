<template>
  <div class="bg-white rounded-xl shadow-sm border p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-semibold">
        {{ currentMonthYear }}
      </h2>
      <div class="flex gap-2">
        <button @click="previousMonth" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Dias da semana -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-sm font-medium text-gray-600 p-2">
        {{ day }}
      </div>
    </div>

    <!-- Dias do mês -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        :class="[
          'p-3 text-center rounded-lg cursor-pointer transition-colors',
          day.isCurrentMonth ? 'hover:bg-blue-50' : 'text-gray-400',
          day.isToday ? 'bg-blue-600 text-white hover:bg-blue-700' : '',
          day.hasMaintenances ? 'font-bold' : ''
        ]"
        @click="selectDay(day)"
      >
        <div class="text-sm">{{ day.date }}</div>
        <div v-if="day.maintenanceCount > 0" class="text-xs mt-1">
          <span class="inline-block w-2 h-2 rounded-full bg-red-500"></span>
          {{ day.maintenanceCount }}
        </div>
      </div>
    </div>

    <!-- Legenda -->
    <div class="mt-6 flex items-center gap-4 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-blue-600"></div>
        <span class="text-gray-600">Hoje</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <span class="text-gray-600">Manutenções agendadas</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const props = defineProps({
  maintenances: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['day-selected'])

const currentDate = ref(new Date())
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const currentMonthYear = computed(() => {
  return format(currentDate.value, 'MMMM yyyy', { locale: ptBR })
})

const calendarDays = computed(() => {
  const start = startOfMonth(currentDate.value)
  const end = endOfMonth(currentDate.value)
  const days = eachDayOfInterval({ start, end })
  
  // Adicionar dias do mês anterior para preencher a primeira semana
  const firstDayOfWeek = start.getDay()
  const prevMonthDays = []
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const day = new Date(start)
    day.setDate(day.getDate() - (i + 1))
    prevMonthDays.push(day)
  }
  
  // Adicionar dias do próximo mês para preencher a última semana
  const lastDayOfWeek = end.getDay()
  const nextMonthDays = []
  for (let i = 1; i <= 6 - lastDayOfWeek; i++) {
    const day = new Date(end)
    day.setDate(day.getDate() + i)
    nextMonthDays.push(day)
  }
  
  const allDays = [...prevMonthDays, ...days, ...nextMonthDays]
  
  return allDays.map(day => {
    const maintenanceCount = props.maintenances.filter(m => 
      isSameDay(new Date(m.dataAgendada), day)
    ).length
    
    return {
      date: day.getDate(),
      fullDate: day,
      isCurrentMonth: isSameMonth(day, currentDate.value),
      isToday: isSameDay(day, new Date()),
      hasMaintenances: maintenanceCount > 0,
      maintenanceCount
    }
  })
})

const previousMonth = () => {
  currentDate.value = subMonths(currentDate.value, 1)
}

const nextMonth = () => {
  currentDate.value = addMonths(currentDate.value, 1)
}

const selectDay = (day) => {
  emit('day-selected', day.fullDate)
}
</script>
