<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
          SM
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Bem-vindo ao SMPM</h1>
        <p class="text-blue-100">Sistema de Manutenção Preventiva</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-xl p-8">
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="label">E-mail</label>
            <input v-model="form.email" type="email" class="input" placeholder="seu@email.com" required />
          </div>

          <div>
            <label class="label">Senha</label>
            <input v-model="form.senha" type="password" class="input" placeholder="••••••••" required />
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {{ error }}
          </div>

          <button type="submit" class="w-full btn btn-primary py-3" :disabled="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t"></div></div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Não tem conta?</span>
          </div>
        </div>

        <router-link to="/register" class="block text-center py-3 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
          Criar nova conta
        </router-link>
      </div>

      <p class="text-center text-sm text-blue-100 mt-8">© 2024 SMPM - SENAI Roberto Mange</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', senha: '' })
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.status === 401 ? 'Email ou senha incorretos' : 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>