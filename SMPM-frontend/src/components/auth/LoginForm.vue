<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
        SM
      </div>
      <h1 class="text-3xl font-bold text-white mb-2">Bem-vindo ao SMPM</h1>
      <p class="text-blue-100">Sistema de Manutenção Preventiva de Máquinas</p>
    </div>

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

        <!-- Lembrar-me -->
        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              v-model="rememberMe"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-600">Lembrar-me</span>
          </label>
          <a href="#" class="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Esqueceu a senha?
          </a>
        </div>

        <!-- Botão Submit -->
        <button
          type="submit"
          class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition-all"
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

      <!-- Link para Registro -->
      <router-link
        to="/register"
        class="block text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
      >
        Criar nova conta
      </router-link>
    </div>

    <!-- Footer -->
    <p class="text-center text-sm text-blue-100 mt-8">
      © 2024 SMPM - SENAI Roberto Mange
    </p>
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

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(formData.value)
    router.push('/')
  } catch (error) {
    console.error('Erro no login:', error)
  } finally {
    loading.value = false
  }
}
</script>