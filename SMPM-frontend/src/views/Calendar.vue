<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900">Relatórios</h1>
      <p class="text-gray-600 mt-1">Análise e estatísticas do sistema</p>
    </div>

    <!-- Filtros de Período -->
    <div class="card">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="label">Data Inicial</label>
          <input v-model="filters.dataInicio" type="date" class="input" />
        </div>
        <div>
          <label class="label">Data Final</label>
          <input v-model="filters.dataFim" type="date" class="input" />
        </div>
        <div class="flex items-end">
          <button @click="generateReport" class="btn btn-primary w-full">
            Gerar Relatório
          </button>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card gradient-primary text-white">
        <p class="text-sm opacity-90">Total de Manutenções</p>
        <p class="text-4xl font-bold mt-2">{{ kpis?.total || 0 }}</p>
      </div>
      <div class="card gradient-success text-white">
        <p class="text-sm opacity-90">Taxa de Conclusão</p>
        <p class="text-4xl font-bold mt-2">{{ completionRate }}%</p>
      </div>
      <div class="card gradient-warning text-white">
        <p class="text-sm opacity-90">Tempo Médio</p>
        <p class="text-4xl font-bold mt-2">{{ avgTime }}h</p>
      </div>
      <div class="card gradient-danger text-white">
        <p class="text-sm opacity-90">Custo Total</p>
        <p class="text-4xl font-bold mt-2">{{ formatCurrency(kpis?.custoTotal || 0) }}</p>
      </div>
    </div>

    <!-- Gráficos Simples -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Manutenções por Tipo -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Manutenções por Tipo</h3>
        <div class="space-y-3">
          <div v-for="(count, tipo) in maintenancesByType" :key="tipo">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ tipo }}</span>
              <span class="font-semibold">{{ count }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-500 h-2 rounded-full"
                :style="{ width: `${(count / kpis?.total) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manutenções por Status -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Manutenções por Status</h3>
        <div class="space-y-3">
          <div v-for="(count, status) in maintenancesByStatus" :key="status">
            <div class="flex justify-between text-sm mb-1">
              <span>{{ status }}</span>
              <span class="font-semibold">{{ count }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                :class="getStatusBarColor(status)"
                class="h-2 rounded-full"
                :style="{ width: `${(count / kpis?.total) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela de Resumo -->
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Resumo Detalhado</h3>
        <button @click="exportReport" class="btn btn-outline">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Máquina</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Concluídas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Custo</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in summaryData" :key="item.machine">
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.machine }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.total }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ item.completed }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ formatCurrency(item.cost) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMaintenancesStore } from '@/stores/maintenances'
import { formatCurrency } from '@/utils/helpers'
import { format } from 'date-fns'

const store = useMaintenancesStore()

const filters = ref({
  dataInicio: format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), 'yyyy-MM-dd'),
  dataFim: format(new Date(), 'yyyy-MM-dd')
})

const kpis = computed(() => store.kpis)

const completionRate = computed(() => {
  if (!kpis.value?.total) return 0
  return Math.round((kpis.value.concluidas / kpis.value.total) * 100)
})

const avgTime = computed(() => {
  const completed = store.maintenances.filter(m => m.status === 'Concluída' && m.duracao)
  if (completed.length === 0) return 0
  const total = completed.reduce((sum, m) => sum + (m.duracao || 0), 0)
  return Math.round(total / completed.length)
})

const maintenancesByType = computed(() => {
  const types = {}
  store.maintenances.forEach(m => {
    types[m.tipo] = (types[m.tipo] || 0) + 1
  })
  return types
})

const maintenancesByStatus = computed(() => {
  const status = {}
  store.maintenances.forEach(m => {
    status[m.status] = (status[m.status] || 0) + 1
  })
  return status
})

const summaryData = computed(() => {
  const data = {}
  store.maintenances.forEach(m => {
    const machine = m.maquina?.nome || 'Desconhecida'
    if (!data[machine]) {
      data[machine] = { machine, total: 0, completed: 0, cost: 0 }
    }
    data[machine].total++
    if (m.status === 'Concluída') data[machine].completed++
    data[machine].cost += m.custoTotal || 0
  })
  return Object.values(data)
})

const getStatusBarColor = (status) => {
  const colors = {
    'Pendente': 'bg-yellow-500',
    'Em Andamento': 'bg-blue-500',
    'Concluída': 'bg-green-500',
    'Cancelada': 'bg-red-500'
  }
  return colors[status] || 'bg-gray-500'
}

const generateReport = () => {
  store.setFilters(filters.value)
}

const exportReport = () => {
  const csv = [
    ['Máquina', 'Total', 'Concluídas', 'Custo'],
    ...summaryData.value.map(item => [
      item.machine,
      item.total,
      item.completed,
      item.cost
    ])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
}

onMounted(() => {
  store.fetchKpis()
  store.fetchMaintenances()
})
</script>