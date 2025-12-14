<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/login">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">
            SM
          </div>
        </router-link>
        <h1 class="text-3xl font-bold text-white mb-2">Criar Conta</h1>
        <p class="text-blue-100">Preencha os dados para se cadastrar</p>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome completo <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.nome"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="João Silva"
              required
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              E-mail <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
              required
            />
          </div>

          <!-- Senha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Senha <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                v-model="form.senha"
                :type="showPassword ? 'text' : 'password'"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="••••••••"
                minlength="6"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">Mínimo de 6 caracteres</p>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Confirmar senha <span class="text-red-500">*</span>
            </label>
            <input
              v-model="confirmSenha"
              :type="showPassword ? 'text' : 'password'"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <!-- Role -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Função <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.role"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              required
            >
              <option value="operador">Operador</option>
              <option value="tecnico">Técnico</option>
              <option value="admin">Administrador</option>
            </select>
            <p class="text-xs text-gray-500 mt-1">
              <span v-if="form.role === 'admin'">• Acesso total ao sistema</span>
              <span v-if="form.role === 'tecnico'">• Pode gerenciar manutenções</span>
              <span v-if="form.role === 'operador'">• Pode visualizar informações</span>
            </p>
          </div>

          <!-- Termos -->
          <label class="flex items-start">
            <input
              v-model="acceptTerms"
              type="checkbox"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              required
            />
            <span class="ml-2 text-sm text-gray-600">
              Eu aceito os <a href="#" class="text-blue-600 hover:underline">termos de uso</a> 
              e a <a href="#" class="text-blue-600 hover:underline">política de privacidade</a>
            </span>
          </label>

          <!-- Mensagem de erro -->
          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-red-800">{{ error }}</p>
            </div>
          </div>

          <!-- Mensagem de sucesso -->
          <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <p class="text-sm text-green-800">Conta criada com sucesso! Redirecionando...</p>
            </div>
          </div>

          <!-- Botão Submit -->
          <button
            type="submit"
            class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="loading || !acceptTerms"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Criando conta...
            </span>
            <span v-else>Criar conta</span>
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

        <!-- Link Login -->
        <router-link
          to="/login"
          class="block text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
        >
          Fazer login
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

const form = ref({
  nome: '',
  email: '',
  senha: '',
  role: 'admin'
})

const confirmSenha = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  error.value = ''
  success.value = false

  // Validar senhas
  if (form.value.senha !== confirmSenha.value) {
    error.value = 'As senhas não coincidem'
    return
  }

  if (form.value.senha.length < 6) {
    error.value = 'A senha deve ter no mínimo 6 caracteres'
    return
  }

  loading.value = true
  
  try {
    await authStore.register(form.value)
    success.value = true
    
    // Aguarda 1.5 segundos e redireciona
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    error.value = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
    console.error('Erro:', err)
  } finally {
    loading.value = false
  }
}
</script>