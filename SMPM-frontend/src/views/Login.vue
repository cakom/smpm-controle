<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
          SM
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Bem-vindo ao SMPM</h1>
        <p class="text-blue-100">Sistema de Manutenção Preventiva de Máquinas</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
            <input
              v-model="formData.email"
              type="email"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <!-- Senha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <input
              v-model="formData.senha"
              type="password"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- ADICIONE ESTA PARTE - Mensagem de erro -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>

          <!-- Lembrar-me -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 text-blue-600 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-600">Lembrar-me</span>
            </label>
          </div>

          <!-- Botão Submit -->
          <button
            type="submit"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <!-- Divisor -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Não tem uma conta?</span>
          </div>
        </div>

        <!-- Link Registro -->
        <router-link
          to="/register"
          class="block text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          Criar nova conta
        </router-link>
      </div>

      <!-- Footer -->
      <p class="text-center text-sm text-blue-100 mt-8">
        © 2024 SMPM - SENAI Roberto Mange
      </p>
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
  email: '',
  senha: ''
})

const rememberMe = ref(false)
const loading = ref(false)
const error = ref('') // ADICIONE ESTA LINHA

const handleLogin = async () => {
  loading.value = true
  error.value = '' // LIMPAR ERRO ANTERIOR
  
  try {
    await authStore.login(formData.value)
    router.push('/')
  } catch (err) {
    // ADICIONE ESTAS LINHAS:
    console.error('Erro no login:', err)
    if (err.response?.status === 401) {
      error.value = 'Email ou senha incorretos'
    } else if (err.response?.status === 404) {
      error.value = 'Usuário não encontrado. Crie uma conta primeiro.'
    } else {
      error.value = 'Erro ao fazer login. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>