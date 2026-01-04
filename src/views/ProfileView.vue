<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { UpdateUserData } from '@/types/User'

const router = useRouter()
const authStore = useAuthStore()

const form = ref<UpdateUserData & { confirmPassword: string }>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref<string>('')
const success = ref<string>('')
const loading = ref(false)

const user = computed(() => authStore.user)

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  if (user.value) {
    form.value.name = user.value.name
    form.value.email = user.value.email
  }
})

async function handleSubmit() {
  error.value = ''
  success.value = ''

  // Validação de senha se foi preenchida
  if (form.value.password) {
    if (form.value.password.length < 6) {
      error.value = 'A senha deve ter pelo menos 6 caracteres'
      return
    }

    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'As senhas não coincidem'
      return
    }
  }

  loading.value = true

  try {
    const { confirmPassword, ...updateData } = form.value
    // Remove campos vazios
    const dataToUpdate: UpdateUserData = {}
    if (updateData.name) dataToUpdate.name = updateData.name
    if (updateData.email) dataToUpdate.email = updateData.email
    if (updateData.password) dataToUpdate.password = updateData.password

    authStore.updateUser(dataToUpdate)
    success.value = 'Informações atualizadas com sucesso!'
    
    // Limpa campos de senha
    form.value.password = ''
    form.value.confirmPassword = ''
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao atualizar informações'
  } finally {
    loading.value = false
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 p-5">
    <div class="bg-white rounded-xl p-10 w-full max-w-lg shadow-2xl">
      <h1 class="text-3xl font-bold text-gray-800 text-center mb-8">Meu Perfil</h1>
      
      <div v-if="user" class="bg-gray-50 p-4 rounded-lg mb-6 text-sm text-gray-600">
        <p class="mb-2"><strong class="text-gray-800">ID:</strong> {{ user.id }}</p>
        <p><strong class="text-gray-800">Cadastrado em:</strong> {{ new Date(user.createdAt).toLocaleDateString('pt-BR') }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium text-gray-700 text-sm">Nome</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Seu nome completo"
            required
            autocomplete="name"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

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
          <label for="password" class="font-medium text-gray-700 text-sm">Nova Senha (deixe em branco para manter)</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            minlength="6"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="confirmPassword" class="font-medium text-gray-700 text-sm">Confirmar Nova Senha</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            minlength="6"
            class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
          />
        </div>

        <div v-if="error" class="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 text-green-600 p-3 rounded-lg text-sm border border-green-200">
          {{ success }}
        </div>

        <div class="flex flex-col gap-3">
          <button 
            type="submit" 
            :disabled="loading" 
            class="w-full py-3.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-base font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] hover:shadow-lg"
          >
            {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
          
          <button 
            type="button" 
            @click="handleLogout" 
            class="w-full py-3.5 bg-red-600 text-white rounded-lg text-base font-semibold hover:bg-red-700 transition-all transform hover:scale-[1.02] hover:shadow-lg"
          >
            Sair
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
