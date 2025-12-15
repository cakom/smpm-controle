<template>
  <nav class="bg-white border-b border-gray-200 fixed w-full top-0 z-50 shadow-sm">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <button @click="$emit('toggle-sidebar')" class="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="flex items-center">
            <div class="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center text-white font-bold">SM</div>
            <div class="ml-3 hidden sm:block">
              <h1 class="text-xl font-bold text-gray-900">SMPM</h1>
              <p class="text-xs text-gray-500">Manutenção Preventiva</p>
            </div>
          </div>
        </div>

        <!-- Menu do Usuário -->
        <div class="relative">
          <button @click="showMenu = !showMenu" class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <div class="w-8 h-8 gradient-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {{ userInitials }}
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
              <p class="text-xs text-gray-500">{{ userRole }}</p>
            </div>
          </button>

          <!-- Dropdown -->
          <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
            <button @click="handleLogout" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getInitials } from '@/utils/helpers'

defineEmits(['toggle-sidebar'])

const router = useRouter()
const authStore = useAuthStore()
const showMenu = ref(false)

const userName = computed(() => authStore.user?.nome || 'Usuário')
const userRole = computed(() => {
  const roles = { admin: 'Administrador', tecnico: 'Técnico', operador: 'Operador' }
  return roles[authStore.user?.role] || 'Usuário'
})
const userInitials = computed(() => getInitials(userName.value))

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>