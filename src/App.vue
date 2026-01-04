<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userName = computed(() => authStore.userName)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav v-if="isAuthenticated" class="bg-gradient-to-r from-purple-600 to-purple-800 py-4 shadow-lg">
    <div class="max-w-7xl mx-auto px-5 flex justify-between items-center">
      <router-link to="/" class="text-white text-2xl font-bold hover:opacity-90 transition-opacity">
        Study Tracker
      </router-link>
      <div class="flex items-center gap-5">
        <router-link 
          to="/" 
          class="text-white font-medium hover:opacity-80 transition-opacity"
        >
          Estudos
        </router-link>
        <router-link 
          to="/profile" 
          class="text-white font-medium hover:opacity-80 transition-opacity"
        >
          Perfil
        </router-link>
        <span class="text-white font-medium px-4 py-2 bg-white/20 rounded-full">
          {{ userName }}
        </span>
        <button 
          @click="handleLogout" 
          class="bg-white/20 text-white border border-white/30 px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  </nav>
  <router-view />
</template>
