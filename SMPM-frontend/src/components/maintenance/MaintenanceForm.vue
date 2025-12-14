<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Máquina -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Máquina <span class="text-red-500">*</span>
      </label>
      <select v-model="formData.maquina" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required>
        <option value="">Selecione a máquina</option>
        <option v-for="machine in machines" :key="machine._id" :value="machine._id">
          {{ machine.nome }}
        </option>
      </select>
    </div>

    <!-- Tipo e Status -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Tipo <span class="text-red-500">*</span>
        </label>
        <select v-model="formData.tipo" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required>
          <option value="Preventiva">Preventiva</option>
          <option value="Corretiva">Corretiva</option>
          <option value="Preditiva">Preditiva</option>
          <option value="Inspeção">Inspeção</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Status <span class="text-red-500">*</span>
        </label>
        <select v-model="formData.status" class="w-full px-4 py-2.5 border border-gray-300 rounded-lg" required>
          <option value="Pendente">Pendente</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>
    </div>

    <!-- Prioridade -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Prioridade <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-4 gap-3">
        <button
          type="button"
          @click="formData.prioridade = 'Baixa'"
          :class="[
            'px-4 py-3 rounded-lg border-2 transition-all',
            formData.prioridade === 'Baixa'
              ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          Baixa
        </button>
        <button
          type="button"
          @click="formData.prioridade = 'Média'"
          :class="[
            'px-4 py-3 rounded-lg border-2 transition-all',
            formData.prioridade === 'Média'
              ? 'border-yellow-500 bg-yellow-50 text-yellow-700 font-semibold'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          Média
        </button>
        <button
          type="button"
          @click="formData.prioridade = 'Alta'"
          :class="[
            'px-4 py-3 rounded-lg border-2 transition-all',
            formData.prioridade === 'Alta'
              ? 'border-orange-500 bg-orange-50 text-orange-700 font-semibold'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          Alta
        </button>
        <button
          type="button"
          @click="formData.prioridade = 'Crítica'"
          :class="[
            'px-4 py-3 rounded-lg border-2 transition-all',
            formData.prioridade === 'Crítica'
              ? 'border-red-500 bg-red-50 text-red-700 font-semibold'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          Crítica
        </button>
      </div>
    </div>

    <!-- Data Agendada -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Data Agendada <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.dataAgendada"
        type="datetime-local"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
        required
      />
    </div>

    <!-- Descrição -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Descrição <span class="text-red-500">*</span>
      </label>
      <textarea
        v-model="formData.descricao"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
        rows="4"
        placeholder="Descreva os procedimentos a serem realizados..."
        maxlength="1000"
        required
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">
        {{ formData.descricao?.length || 0 }}/1000 caracteres
      </p>
    </div>

    <!-- Observações -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Observações</label>
      <textarea
        v-model="formData.observacoes"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
        rows="3"
        placeholder="Informações adicionais..."
        maxlength="500"
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">
        {{ formData.observacoes?.length || 0 }}/500 caracteres
      </p>
    </div>

    <!-- Mensagem de Erro -->
    <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-sm text-red-800">{{ errorMessage }}</p>
    </div>

    <!-- Botões -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        :disabled="loading"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 disabled:opacity-50"
        :disabled="loading"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Aguarde...
        </span>
        <span v-else>{{ isEdit ? 'Atualizar' : 'Agendar' }}</span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { format } from 'date-fns'
import api from '@/services/api'

const props = defineProps({
  maintenance: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.maintenance)
const machines = ref([])
const errorMessage = ref('')

const formData = ref({
  maquina: '',
  tipo: 'Preventiva',
  status: 'Pendente',
  prioridade: 'Média',
  dataAgendada: '',
  tecnicoResponsavel: '',
  descricao: '',
  observacoes: ''
})

// Carregar máquinas
onMounted(async () => {
  try {
    const response = await api.machines.getAll()
    machines.value = response.data.data || response.data
    console.log('Máquinas carregadas:', machines.value)
  } catch (error) {
    console.error('Erro ao carregar máquinas:', error)
    errorMessage.value = 'Erro ao carregar máquinas. Verifique se há máquinas cadastradas.'
  }
})

// Preencher formulário se estiver editando
watch(() => props.maintenance, (maintenance) => {
  if (maintenance) {
    formData.value = {
      maquina: maintenance.maquina?._id || maintenance.maquina || '',
      tipo: maintenance.tipo || 'Preventiva',
      status: maintenance.status || 'Pendente',
      prioridade: maintenance.prioridade || 'Média',
      dataAgendada: maintenance.dataAgendada ? format(new Date(maintenance.dataAgendada), "yyyy-MM-dd'T'HH:mm") : '',
      tecnicoResponsavel: maintenance.tecnicoResponsavel?._id || '',
      descricao: maintenance.descricao || '',
      observacoes: maintenance.observacoes || ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  errorMessage.value = ''
  
  console.log('Formulário enviado:', formData.value)
  
  // Validações
  if (!formData.value.maquina) {
    errorMessage.value = 'Selecione uma máquina'
    return
  }
  
  if (!formData.value.descricao) {
    errorMessage.value = 'Preencha a descrição'
    return
  }
  
  if (!formData.value.dataAgendada) {
    errorMessage.value = 'Selecione a data agendada'
    return
  }
  
  emit('submit', formData.value)
}
</script>
