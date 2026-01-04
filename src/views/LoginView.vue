<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { LoginCredentials } from '@/types/User'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<LoginCredentials>({
  email: '',
  password: ''
})

const error = ref<string>('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    authStore.login(form.value)
    router.push('/')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-5">
    <div class="bg-white rounded-xl p-10 w-full max-w-md shadow-2xl">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-8">Login</h1>
      
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="flex flex-col gap-2">
          <label for="email" class="font-medium text-gray-700 text-sm">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            required
            autocomplete="email"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="font-medium text-gray-700 text-sm">Senha</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading" 
          class="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-base font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] hover:shadow-lg"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="mt-6 text-center text-gray-600 text-sm">
        <p>Não tem uma conta? <router-link to="/register" class="text-purple-600 font-semibold hover:underline">Cadastre-se</router-link></p>
      </div>
    </div>
  </div>
</template>
