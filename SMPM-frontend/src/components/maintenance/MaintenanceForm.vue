<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Máquina -->
    <div>
      <label class="label">
        Máquina <span class="text-red-500">*</span>
      </label>
      <select v-model="formData.maquina" class="input" required>
        <option value="">Selecione a máquina</option>
        <option v-for="machine in machines" :key="machine._id" :value="machine._id">
          {{ machine.nome }} - {{ machine.setor }}
        </option>
      </select>
    </div>

    <!-- Tipo e Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">
          Tipo <span class="text-red-500">*</span>
        </label>
        <select v-model="formData.tipo" class="input" required>
          <option value="">Selecione o tipo</option>
          <option v-for="(tipo, key) in MAINTENANCE_TYPES" :key="key" :value="tipo.value">
            {{ tipo.label }}
          </option>
        </select>
      </div>

      <div>
        <label class="label">
          Status <span class="text-red-500">*</span>
        </label>
        <select v-model="formData.status" class="input" required>
          <option v-for="(status, key) in MAINTENANCE_STATUS" :key="key" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Prioridade -->
    <div>
      <label class="label">
        Prioridade <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          v-for="(priority, key) in PRIORITIES"
          :key="key"
          type="button"
          @click="formData.prioridade = priority.value"
          :class="[
            'px-4 py-3 rounded-lg border-2 transition-all',
            formData.prioridade === priority.value
              ? 'border-primary-500 bg-primary-50 text-primary-700 font-semibold'
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          {{ priority.label }}
        </button>
      </div>
    </div>

    <!-- Data Agendada -->
    <div>
      <label class="label">
        Data Agendada <span class="text-red-500">*</span>
      </label>
      <input
        v-model="formData.dataAgendada"
        type="datetime-local"
        class="input"
        required
      />
    </div>

    <!-- Técnico Responsável (opcional) -->
    <div>
      <label class="label">Técnico Responsável</label>
      <select v-model="formData.tecnicoResponsavel" class="input">
        <option value="">Não atribuído</option>
        <option v-for="user in technicians" :key="user._id" :value="user._id">
          {{ user.nome }}
        </option>
      </select>
    </div>

    <!-- Descrição -->
    <div>
      <label class="label">
        Descrição <span class="text-red-500">*</span>
      </label>
      <textarea
        v-model="formData.descricao"
        class="input resize-none"
        rows="4"
        placeholder="Descreva os procedimentos e atividades a serem realizados..."
        maxlength="1000"
        required
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">
        {{ formData.descricao?.length || 0 }}/1000 caracteres
      </p>
    </div>

    <!-- Observações -->
    <div>
      <label class="label">Observações</label>
      <textarea
        v-model="formData.observacoes"
        class="input resize-none"
        rows="3"
        placeholder="Informações adicionais..."
        maxlength="500"
      ></textarea>
      <p class="text-xs text-gray-500 mt-1">
        {{ formData.observacoes?.length || 0 }}/500 caracteres
      </p>
    </div>

    <!-- Botões -->
    <div class="flex justify-end gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="btn btn-outline"
        :disabled="loading"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="loading"
      >
        <svg
          v-if="loading"
          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isEdit ? 'Atualizar' : 'Agendar' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { MAINTENANCE_STATUS, MAINTENANCE_TYPES, PRIORITIES } from '@/utils/constants'
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
const technicians = ref([])

const formData = ref({
  maquina: '',
  tipo: '',
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
    machines.value = response.data.data
  } catch (error) {
    console.error('Erro ao carregar máquinas:', error)
  }
})

// Preencher formulário se estiver editando
watch(() => props.maintenance, (maintenance) => {
  if (maintenance) {
    formData.value = {
      maquina: maintenance.maquina?._id || maintenance.maquina || '',
      tipo: maintenance.tipo || '',
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
  emit('submit', formData.value)
}
</script>