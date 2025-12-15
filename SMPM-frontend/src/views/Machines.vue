<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Visão geral do sistema de manutenção</p>
      </div>
      <router-link to="/maintenances" class="mt-4 md:mt-0 btn btn-primary">
        + Nova Manutenção
      </router-link>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard title="Total" :value="kpis?.total || 0" icon="maintenance" color="primary" />
      <KpiCard title="Pendentes" :value="kpis?.pendentes || 0" icon="alert" color="warning" />
      <KpiCard title="Em Andamento" :value="kpis?.emAndamento || 0" icon="maintenance" color="info" />
      <KpiCard title="Concluídas" :value="kpis?.concluidas || 0" icon="chart" color="success" />
    </div>

    <!-- Alerta de atrasadas -->
    <div v-if="kpis?.atrasadas > 0" class="card bg-red-50 border-red-200">
      <div class="flex items-start">
        <svg class="w-6 h-6 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <h3 class="text-sm font-semibold text-red-800">Atenção: {{ kpis.atrasadas }} manutenção(ões) atrasada(s)</h3>
          <router-link to="/maintenances" class="text-sm text-red-700 hover:underline">Ver todas →</router-link>
        </div>
      </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Próximas Manutenções -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold">Próximas Manutenções</h2>
          <router-link to="/maintenances" class="text-sm text-blue-600 hover:underline">Ver todas →</router-link>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="pendingMaintenances.length === 0" class="text-center py-8 text-gray-500">
          Nenhuma manutenção agendada
        </div>

        <div v-else class="space-y-3">
          <div v-for="m in pendingMaintenances.slice(0, 5)" :key="m._id"
               class="p-4 border rounded-lg hover:border-blue-300 cursor-pointer"
               @click="$router.push('/maintenances')">
            <div class="flex gap-2 mb-2">
              <span class="badge badge-info text-xs">{{ m.tipo }}</span>
              <span class="badge badge-warning text-xs">{{ m.prioridade }}</span>
            </div>
            <h3 class="font-medium">{{ m.maquina?.nome }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ m.descricao }}</p>
            <p class="text-xs text-gray-500 mt-2">{{ formatDateTime(m.dataAgendada) }}</p>
          </div>
        </div>
      </div>

      <!-- Ações Rápidas -->
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">Ações Rápidas</h3>
        <div class="space-y-2">
          <router-link to="/machines" class="flex items-center p-3 rounded-lg hover:bg-gray-50">
            <span class="mr-3">🏭</span>
            <span class="text-sm font-medium">Gerenciar Máquinas</span>
          </router-link>
          <router-link to="/calendar" class="flex items-center p-3 rounded-lg hover:bg-gray-50">
            <span class="mr-3">📅</span>
            <span class="text-sm font-medium">Ver Calendário</span>
          </router-link>
          <router-link to="/reports" class="flex items-center p-3 rounded-lg hover:bg-gray-50">
            <span class="mr-3">📊</span>
            <span class="text-sm font-medium">Relatórios</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useMaintenancesStore } from '@/stores/maintenances'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import { formatDateTime } from '@/utils/helpers'

const store = useMaintenancesStore()

const loading = computed(() => store.loading)
const kpis = computed(() => store.kpis)
const pendingMaintenances = computed(() => store.pendingMaintenances)

onMounted(() => {
  store.fetchKpis()
  store.fetchMaintenances()
})
</script>