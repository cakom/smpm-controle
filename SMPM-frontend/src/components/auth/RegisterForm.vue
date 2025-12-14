<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <router-link to="/login" class="inline-block mb-4">
        <div class="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg">
          SM
        </div>
      </router-link>
      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Criar Conta
      </h1>
      <p class="text-gray-600">
        Preencha os dados para se cadastrar
      </p>
    </div>

    <div class="card">
      <form @submit.prevent="handleRegister" class="space-y-5">
        <!-- Nome -->
        <div>
          <label class="label">Nome completo</label>
          <input
            v-model="formData.nome"
            type="text"
            class="input"
            placeholder="João Silva"
            required
            :disabled="loading"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="label">E-mail</label>
          <input
            v-model="formData.email"
            type="email"
            class="input"
            placeholder="seu@email.com"
            required
            :disabled="loading"
          />
        </div>

        <!-- Senha -->
        <div>
          <label class="label">Senha</label>
          <input
            v-model="formData.senha"
            :type="showPassword ? 'text' : 'password'"
            class="input"
            placeholder="••••••••"
            minlength="6"
            required
            :disabled="loading"
          />
          <p class="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
        </div>

        <!-- Confirmar Senha -->
        <div>
          <label class="label">Confirmar senha</label>
          <input
            v-model="confirmPassword"
            :type="showPassword ? 'text' : 'password'"
            class="input"
            placeholder="••••••••"
            required
            :disabled="loading"
          />
        </div>

        <!-- Mostrar senha -->
        <label class="flex items-center">
          <input
            v-model="showPassword"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <span class="ml-2 text-sm text-gray-600">Mostrar senha</span>
        </label>

        <!-- Role -->
        <div>
          <label class="label">Função</label>
          <select v-model="formData.role" class="input" required :disabled="loading">
            <option value="operador">Operador</option>
            <option value="tecnico">Técnico</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <!-- Termos -->
        <label class="flex items-start">
          <input
            v-model="acceptTerms"
            type="checkbox"
            class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-0.5"
            required
          />
          <span class="ml-2 text-sm text-gray-600">
            Eu aceito os <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">termos de uso</a> e a <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">política de privacidade</a>
          </span>
        </label>

        <!-- Mensagem de erro -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ errorMessage }}</p>
        </div>

        <!-- Botão Submit -->
        <button
          type="submit"
          class="w-full btn btn-primary py-3"
          :disabled="loading || !acceptTerms"
        >
          <svg
            v-if="loading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Criando conta...' : 'Criar conta' }}
        </button>
      </form>

      <!-- Divisor -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Já tem uma conta?</span>
        </div>
      </div>

      <!-- Link para Login -->
      <router-link
        to="/login"
        class="block text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
      >
        Fazer login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formData = ref({
  nome: '',
  email: '',
  senha: '',
  role: 'operador'
})

const confirmPassword = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''

  // Validar senhas
  if (formData.value.senha !== confirmPassword.value) {
    errorMessage.value = 'As senhas não coincidem'
    return
  }

  loading.value = true
  try {
    await authStore.register(formData.value)
    router.push('/')
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao criar conta'
  } finally {
    loading.value = false
  }
}
</script>