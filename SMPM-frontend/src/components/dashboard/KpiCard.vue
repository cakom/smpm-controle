<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ formattedValue }}</h3>
        <div class="flex items-center space-x-2">
          <span v-if="change" :class="['text-sm font-medium', trendColor]">
            {{ change }}
          </span>
          <span v-if="period" class="text-sm text-gray-500">{{ period }}</span>
        </div>
      </div>

      <div :class="['w-12 h-12 rounded-lg flex items-center justify-center', bgColor]">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path v-if="icon === 'chart'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          <path v-if="icon === 'maintenance'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          <path v-if="icon === 'alert'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    required: true
  },
  change: {
    type: String,
    default: ''
  },
  period: {
    type: String,
    default: ''
  },
  trend: {
    type: String,
    default: 'neutral',
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  icon: {
    type: String,
    default: 'chart'
  },
  format: {
    type: String,
    default: 'number'
  }
})

const formattedValue = computed(() => {
  if (props.format === 'currency') {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(props.value)
  } else if (props.format === 'percentage') {
    return `${props.value}%`
  }
  return props.value
})

const trendColor = computed(() => {
  if (props.trend === 'up') return 'text-green-600'
  if (props.trend === 'down') return 'text-red-600'
  return 'text-gray-600'
})

const bgColor = computed(() => {
  const colors = {
    primary: 'bg-gradient-to-br from-blue-500 to-purple-600',
    success: 'bg-gradient-to-br from-green-400 to-green-600',
    warning: 'bg-gradient-to-br from-yellow-400 to-orange-600',
    danger: 'bg-gradient-to-br from-red-400 to-red-600',
    info: 'bg-gradient-to-br from-blue-400 to-blue-600'
  }
  return colors[props.color] || colors.primary
})
</script>
```

---

## ✅ PASSO 3: Verificar o erro REAL no backend

**Vá no terminal do backend e me mostre a mensagem de erro.**

Normalmente aparece algo como:
```
ValidationError: Maintenance validation failed: maquina: Path `maquina` is required
```

OU
```
Cast to ObjectId failed for value "..." at path "maquina"