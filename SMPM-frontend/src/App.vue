<template>
  <div v-if="isLoginPage">
    <router-view />
  </div>
  <div v-else class="min-h-screen bg-gray-50">
    <Navbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />
    
    <div class="lg:pl-64 pt-16">
      <main class="p-6 max-w-7xl mx-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Navbar from '@/components/common/Navbar.vue'
import Sidebar from '@/components/common/Sidebar.vue'

const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(false)
const isLoginPage = computed(() => route.path === '/login')

onMounted(() => {
  authStore.initAuth()
})
</script>