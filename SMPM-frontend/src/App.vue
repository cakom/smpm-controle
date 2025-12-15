<template>
  <!-- Login/Register sem layout -->
  <router-view v-if="isAuthPage" />
  
  <!-- Layout principal com sidebar -->
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

const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))

onMounted(() => authStore.initAuth())
</script>