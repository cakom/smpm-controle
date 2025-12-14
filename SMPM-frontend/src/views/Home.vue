<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-1">Visão geral do sistema de manutenção</p>
      </div>
      <div class="mt-4 md:mt-0 flex gap-3">
        <button
          @click="refreshData"
          class="btn btn-outline"
          :disabled="loading"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Atualizar
        </button>
        <router-link to="/maintenances" class="btn btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nova Manutenção
        </router-link>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total de Manutenções"
        :value="kpis?.total || 0"
        icon="maintenance"
        color="primary"
      />
      <KpiCard
        title="Pendentes"
        :value="kpis?.pendentes || 0"
        change="+12%"
        trend="up"
        icon="alert"
        color="warning"
      />
      <KpiCard
        title="Em Andamento"
        :value="kpis?.emAndamento || 0"
        icon="maintenance"
        color="info"
      />
      <KpiCard
        title="Concluídas"
        :value="kpis?.concluidas || 0"
        change="+8%"
        trend="up"
        icon="chart"
        color="success"
      />
    </div>

    <!-- Alertas -->
    <div v-if="kpis?.atrasadas > 0" class="card bg-red-50 border-red-200">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-semibold text-red-800">
            Atenção: Manutenções Atrasadas
          </h3>
          <p class="text-sm text-red-700 mt-1">
            Existem {{ kpis.atrasadas }} manutenções atrasadas que precisam de atenção imediata.
          </p>
          <div class="mt-3">
            <router-link
              to="/maintenances"
              class="text-sm font-medium text-red-800 hover:text-red-900"
            >
              Ver manutenções atrasadas →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid Principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Próximas Manutenções -->
      <div class="lg:col-span-2">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">
              Próximas Manutenções
            </h2>
            <router-link
              to="/maintenances"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todas →
            </router-link>
          </div>

          <div v-if="loading" class="space-y-4">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="h-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>

          <div v-else-if="upcomingMaintenances.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Nenhuma manutenção agendada</p>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="maintenance in upcomingMaintenances.slice(0, 5)"
              :key="maintenance._id"
              class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors cursor-pointer"
              @click="$router.push('/maintenances')"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="badge badge-info text-xs">
                      {{ maintenance.tipo }}
                    </span>
                    <span class="badge badge-warning text-xs">
                      {{ maintenance.prioridade }}
                    </span>
                  </div>
                  <h3 class="font-medium text-gray-900">
                    {{ maintenance.maquina?.nome }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-1">
                    {{ maintenance.descricao }}
                  </p>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ formatDateTime(maintenance.dataAgendada) }}
                  </p>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estatísticas Rápidas -->
      <div class="space-y-6">
        <!-- Custos -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Custos do Mês
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Total Gasto</span>
              <span class="text-lg font-bold text-gray-900">
                {{ formatCurrency(kpis?.custoTotal || 0) }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full" style="width: 65%"></div>
            </div>
            <p class="text-xs text-gray-500">
              65% do orçamento mensal utilizado
            </p>
          </div>
        </div>

        <!-- Próximos 7 dias -->
        <div class="card bg-primary-50 border-primary-200">
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-semibold text-primary-900">
                Próximos 7 dias
              </h3>
              <p class="text-2xl font-bold text-primary-900 mt-2">
                {{ kpis?.proximos7dias || 0 }}
              </p>
              <p class="text-sm text-primary-700 mt-1">
                Manutenções agendadas
              </p>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="card">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Ações Rápidas
          </h3>
          <div class="space-y-2">
            <router-link
              to="/machines"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span class="text-sm font-medium text-gray-900">Gerenciar Máquinas</span>
            </router-link>
            <router-link
              to="/calendar"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm font-medium text-gray-900">Ver Calendário</span>
            </router-link>
            <router-link
              to="/reports"
              class="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-sm font-medium text-gray-900">Relatórios</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMaintenancesStore } from '@/stores/maintenances'
import KpiCard from '@/components/dashboard/KpiCard.vue'
import { formatDateTime, formatCurrency } from '@/utils/helpers'

const maintenancesStore = useMaintenancesStore()

const loading = ref(false)
const kpis = computed(() => maintenancesStore.kpis)
const upcomingMaintenances = computed(() => maintenancesStore.pendingMaintenances)

const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      maintenancesStore.fetchKpis(),
      maintenancesStore.fetchMaintenances()
    ])
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const refreshData = () => {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>