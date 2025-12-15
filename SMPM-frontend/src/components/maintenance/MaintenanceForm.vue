<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Máquina -->
    <div>
      <label class="label">Máquina *</label>
      <select v-model="form.maquina" class="input" required>
        <option value="">Selecione</option>
        <option v-for="m in machines" :key="m._id" :value="m._id">{{ m.nome }}</option>
      </select>
    </div>

    <!-- Tipo e Status -->
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Tipo *</label>
        <select v-model="form.tipo" class="input" required>
          <option v-for="t in MAINTENANCE_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
      <div>
        <label class="label">Status *</label>
        <select v-model="form.status" class="input" required>
          <option v-for="s in MAINTENANCE_STATUS" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
    </div>

    <!-- Prioridade -->
    <div>
      <label class="label">Prioridade *</label>
      <div class="grid grid-cols-4 gap-2">
        <button v-for="p in PRIORITIES" :key="p" type="button" @click="form.prioridade = p"
          :class="['px-3 py-2 rounded-lg border-2 text-sm transition-all',
            form.prioridade === p ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 hover:border-gray-300']">
          {{ p }}
        </button>
      </div>
    </div>

    <!-- Data -->
    <div>
      <label class="label">Data Agendada *</label>
      <input v-model="form.dataAgendada" type="datetime-local" class="input" required />
    </div>

    <!-- Descrição -->
    <div>
      <label class="label">Descrição *</label>
      <textarea v-model="form.descricao" class="input resize-none" rows="3" required />
    </div>

    <!-- Erro -->
    <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
      {{ error }}
    </div>

    <!-- Buttons -->
    <div class="flex justify-end gap-3 pt-4">
      <button type="button" @click="$emit('cancel')" class="btn btn-outline" :disabled="loading">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Salvando...' : (maintenance ? 'Atualizar' : 'Agendar') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { format } from 'date-fns'
import api from '@/services/api'
import { MAINTENANCE_TYPES, MAINTENANCE_STATUS, PRIORITIES } from '@/utils/constants'

const props = defineProps({
  maintenance: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'cancel'])

const machines = ref([])
const error = ref('')

const form = ref({
  maquina: '',
  tipo: 'Preventiva',
  status: 'Pendente',
  prioridade: 'Média',
  dataAgendada: '',
  descricao: ''
})

onMounted(async () => {
  try {
    const { data } = await api.machines.getAll()
    machines.value = data.data || data
  } catch (e) {
    error.value = 'Erro ao carregar máquinas'
  }
})

watch(() => props.maintenance, (m) => {
  if (m) {
    form.value = {
      maquina: m.maquina?._id || m.maquina || '',
      tipo: m.tipo || 'Preventiva',
      status: m.status || 'Pendente',
      prioridade: m.prioridade || 'Média',
      dataAgendada: m.dataAgendada ? format(new Date(m.dataAgendada), "yyyy-MM-dd'T'HH:mm") : '',
      descricao: m.descricao || ''
    }
  }
}, { immediate: true })

const handleSubmit = () => {
  error.value = ''
  if (!form.value.maquina) { error.value = 'Selecione uma máquina'; return }
  if (!form.value.descricao) { error.value = 'Preencha a descrição'; return }
  if (!form.value.dataAgendada) { error.value = 'Selecione a data'; return }
  emit('submit', form.value)
}
</script>