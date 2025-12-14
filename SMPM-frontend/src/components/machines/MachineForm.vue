<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Nome e Tipo -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">
          Nome da Máquina <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.nome"
          type="text"
          class="input"
          placeholder="Ex: Torno CNC 1000"
          required
        />
      </div>

      <div>
        <label class="label">
          Tipo <span class="text-red-500">*</span>
        </label>
        <select v-model="formData.tipo" class="input" required>
          <option value="">Selecione o tipo</option>
          <option v-for="tipo in MACHINE_TYPES" :key="tipo" :value="tipo">
            {{ tipo }}
          </option>
        </select>
      </div>
    </div>

    <!-- Setor e Status -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">
          Setor <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.setor"
          type="text"
          class="input"
          placeholder="Ex: Usinagem"
          required
        />
      </div>

      <div>
        <label class="label">
          Status <span class="text-red-500">*</span>
        </label>
        <select v-model="formData.status" class="input" required>
          <option v-for="(status, key) in MACHINE_STATUS" :key="key" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Fabricante e Modelo -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">Fabricante</label>
        <input
          v-model="formData.fabricante"
          type="text"
          class="input"
          placeholder="Ex: Romi"
        />
      </div>

      <div>
        <label class="label">Modelo</label>
        <input
          v-model="formData.modelo"
          type="text"
          class="input"
          placeholder="Ex: CNC-1000"
        />
      </div>
    </div>

    <!-- Número de Série e Data de Aquisição -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">Número de Série</label>
        <input
          v-model="formData.numeroSerie"
          type="text"
          class="input"
          placeholder="Ex: TRN-2024-001"
        />
      </div>

      <div>
        <label class="label">Data de Aquisição</label>
        <input
          v-model="formData.dataAquisicao"
          type="date"
          class="input"
        />
      </div>
    </div>

    <!-- Próxima Manutenção e Frequência -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="label">
          Próxima Manutenção <span class="text-red-500">*</span>
        </label>
        <input
          v-model="formData.proximaManutencao"
          type="date"
          class="input"
          required
        />
      </div>

      <div>
        <label class="label">
          Frequência de Manutenção (dias)
        </label>
        <input
          v-model.number="formData.frequenciaManutencao"
          type="number"
          class="input"
          placeholder="30"
          min="1"
        />
      </div>
    </div>

    <!-- Observações -->
    <div>
      <label class="label">Observações</label>
      <textarea
        v-model="formData.observacoes"
        class="input resize-none"
        rows="3"
        placeholder="Informações adicionais sobre a máquina..."
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
        {{ isEdit ? 'Atualizar' : 'Cadastrar' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MACHINE_STATUS, MACHINE_TYPES } from '@/utils/constants'
import { format } from 'date-fns'

const props = defineProps({
  machine: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

const isEdit = ref(!!props.machine)

const formData = ref({
  nome: '',
  tipo: '',
  setor: '',
  status: 'Ativa',
  fabricante: '',
  modelo: '',
  numeroSerie: '',
  dataAquisicao: '',
  proximaManutencao: '',
  frequenciaManutencao: 30,
  observacoes: ''
})

// Preencher formulário se estiver editando
watch(() => props.machine, (machine) => {
  if (machine) {
    formData.value = {
      nome: machine.nome || '',
      tipo: machine.tipo || '',
      setor: machine.setor || '',
      status: machine.status || 'Ativa',
      fabricante: machine.fabricante || '',
      modelo: machine.modelo || '',
      numeroSerie: machine.numeroSerie || '',
      dataAquisicao: machine.dataAquisicao ? format(new Date(machine.dataAquisicao), 'yyyy-MM-dd') : '',
      proximaManutencao: machine.proximaManutencao ? format(new Date(machine.proximaManutencao), 'yyyy-MM-dd') : '',
      frequenciaManutencao: machine.frequenciaManutencao || 30,
      observacoes: machine.observacoes || ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>