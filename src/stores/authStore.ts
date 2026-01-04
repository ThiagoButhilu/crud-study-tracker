// stores/authStore.ts
import { defineStore } from 'pinia'
import type { LoginCredentials, RegisterData, UpdateUserData } from '@/types/User'
import type { User } from '@/types/User'
import * as authService from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: authService.getCurrentUser() as Omit<User, 'password'> | null
  }),

  getters: {
    isAuthenticated: (state) => state.user !== null,
    userName: (state) => state.user?.name || ''
  },

  actions: {
    login(credentials: LoginCredentials): void {
      const user = authService.loginUser(credentials)
      const { password, ...userWithoutPassword } = user
      this.user = userWithoutPassword
    },

    register(userData: RegisterData): void {
      authService.registerUser(userData)
      // Faz login automático após cadastro
      const user = authService.loginUser({ email: userData.email, password: userData.password })
      const { password, ...userWithoutPassword } = user
      this.user = userWithoutPassword
    },

    logout(): void {
      authService.logoutUser()
      this.user = null
    },

    updateUser(data: UpdateUserData): void {
      if (!this.user) return

      const updated = authService.updateUser(this.user.id, data)
      const { password, ...userWithoutPassword } = updated
      this.user = userWithoutPassword
    },

    loadUser(): void {
      this.user = authService.getCurrentUser()
    }
  }
})

