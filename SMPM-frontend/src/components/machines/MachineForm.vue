<template>
  <form @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Nome *</label>
        <input v-model="form.nome" type="text" class="input" required />
      </div>
      <div>
        <label class="label">Tipo *</label>
        <select v-model="form.tipo" class="input" required>
          <option value="">Selecione</option>
          <option v-for="t in MACHINE_TYPES" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Setor *</label>
        <input v-model="form.setor" type="text" class="input" required />
      </div>
      <div>
        <label class="label">Status *</label>
        <select v-model="form.status" class="input" required>
          <option v-for="(s, k) in MACHINE_STATUS" :key="k" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Fabricante</label>
        <input v-model="form.fabricante" type="text" class="input" />
      </div>
      <div>
        <label class="label">Modelo</label>
        <input v-model="form.modelo" type="text" class="input" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="label">Nº Série</label>
        <input v-model="form.numeroSerie" type="text" class="input" />
      </div>
      <div>
        <label class="label">Próxima Manutenção *</label>
        <input v-model="form.proximaManutencao" type="date" class="input" required />
      </div>
    </div>

    <div>
      <label class="label">Observações</label>
      <textarea v-model="form.observacoes" class="input resize-none" rows="3" />
    </div>

    <div class="flex justify-end gap-3 pt-4">
      <button type="button" @click="$emit('cancel')" class="btn btn-outline" :disabled="loading">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Salvando...' : (machine ? 'Atualizar' : 'Cadastrar') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import { MACHINE_STATUS, MACHINE_TYPES } from '@/utils/constants'
import { format } from 'date-fns'

const props = defineProps({
  machine: { type: Object, default: null },
  loading: { type: Boolean, default: false }
})

defineEmits(['submit', 'cancel'])

const form = ref({
  nome: '', tipo: '', setor: '', status: 'Ativa',
  fabricante: '', modelo: '', numeroSerie: '',
  proximaManutencao: '', observacoes: ''
})

watch(() => props.machine, (m) => {
  if (m) {
    form.value = {
      nome: m.nome || '',
      tipo: m.tipo || '',
      setor: m.setor || '',
      status: m.status || 'Ativa',
      fabricante: m.fabricante || '',
      modelo: m.modelo || '',
      numeroSerie: m.numeroSerie || '',
      proximaManutencao: m.proximaManutencao ? format(new Date(m.proximaManutencao), 'yyyy-MM-dd') : '',
      observacoes: m.observacoes || ''
    }
  }
}, { immediate: true })
</script>