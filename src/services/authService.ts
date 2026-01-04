// services/authService.ts
import type { User, LoginCredentials, RegisterData, UpdateUserData } from '@/types/User'

const STORAGE_KEY = 'users'
const AUTH_KEY = 'auth_user'

export function registerUser(userData: RegisterData): User {
  const users = getUsers()

  // Verifica se o email já existe
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email já cadastrado')
  }

  const newUser: User = {
    ...userData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  }

  users.push(newUser)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

  return newUser
}

export function loginUser(credentials: LoginCredentials): User {
  const users = getUsers()
  const user = users.find(
    u => u.email === credentials.email && u.password === credentials.password
  )

  if (!user) {
    throw new Error('Email ou senha incorretos')
  }

  // Salva o usuário logado (sem a senha)
  const { password, ...userWithoutPassword } = user
  localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))

  return user
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY)
}

export function getCurrentUser(): Omit<User, 'password'> | null {
  const data = localStorage.getItem(AUTH_KEY)
  return data ? (JSON.parse(data) as Omit<User, 'password'>) : null
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function getUsers(): User[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as User[]) : []
}

export function updateUser(id: string, data: UpdateUserData): User {
  const users = getUsers()
  const userIndex = users.findIndex(u => u.id === id)

  if (userIndex === -1) {
    throw new Error('Usuário não encontrado')
  }

  const currentUser = users[userIndex]!

  // Se está atualizando email, verifica se já existe
  if (data.email && data.email !== currentUser.email) {
    if (users.some(u => u.email === data.email && u.id !== id)) {
      throw new Error('Email já cadastrado')
    }
  }

  const updatedUser: User = {
    id: currentUser.id,
    name: data.name ?? currentUser.name,
    email: data.email ?? currentUser.email,
    password: data.password ?? currentUser.password,
    createdAt: currentUser.createdAt
  }

  users[userIndex] = updatedUser
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))

  // Se é o usuário logado, atualiza a sessão
  const loggedUser = getCurrentUser()
  if (loggedUser && loggedUser.id === id) {
    const { password, ...userWithoutPassword } = updatedUser
    localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword))
  }

  return updatedUser
}

