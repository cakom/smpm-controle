<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/login">
          <div class="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
            SM
          </div>
        </router-link>
        <h1 class="text-3xl font-bold text-white mb-2">Criar Conta</h1>
        <p class="text-blue-100">Preencha os dados para se cadastrar</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Nome completo *</label>
            <input v-model="form.nome" type="text" class="input" placeholder="João Silva" required />
          </div>

          <div>
            <label class="label">E-mail *</label>
            <input v-model="form.email" type="email" class="input" placeholder="seu@email.com" required />
          </div>

          <div>
            <label class="label">Senha *</label>
            <input v-model="form.senha" :type="showPwd ? 'text' : 'password'" class="input" placeholder="••••••••" minlength="6" required />
            <p class="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
          </div>

          <div>
            <label class="label">Confirmar senha *</label>
            <input v-model="confirmSenha" :type="showPwd ? 'text' : 'password'" class="input" placeholder="••••••••" required />
          </div>

          <label class="flex items-center gap-2">
            <input v-model="showPwd" type="checkbox" class="rounded" />
            <span class="text-sm text-gray-600">Mostrar senha</span>
          </label>

          <div>
            <label class="label">Função *</label>
            <select v-model="form.role" class="input" required>
              <option value="operador">Operador</option>
              <option value="tecnico">Técnico</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
            {{ error }}
          </div>

          <button type="submit" class="w-full btn btn-primary py-3" :disabled="loading">
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </form>

        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t"></div></div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Já tem conta?</span>
          </div>
        </div>

        <router-link to="/login" class="block text-center py-3 border rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
          Fazer login
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

const form = ref({ nome: '', email: '', senha: '', role: 'admin' })
const confirmSenha = ref('')
const showPwd = ref(false)
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  error.value = ''
  if (form.value.senha !== confirmSenha.value) { error.value = 'As senhas não coincidem'; return }
  if (form.value.senha.length < 6) { error.value = 'Senha deve ter mínimo 6 caracteres'; return }

  loading.value = true
  try {
    await authStore.register(form.value)
    router.push('/')
  } catch (e) {
    error.value = e.response?.data?.message || 'Erro ao criar conta'
  } finally {
    loading.value = false
  }
}
</script>