<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Study } from '@/types/Study'

type StudyFormData = Omit<Study, 'id'>

const props = defineProps<{
  modelValue?: StudyFormData
}>()

const emit = defineEmits<{
  (e: 'submit', value: StudyFormData): void
}>()

const form = reactive<StudyFormData>({
  title: '',
  subject: '',
  minutes: 0,
  createdAt: new Date().toISOString()
})

watch(
  () => props.modelValue,
  value => {
    if (value) Object.assign(form, value)
  },
  { immediate: true }
)

function submit() {
  emit('submit', { ...form })
  // Limpa o formulário após submit
  form.title = ''
  form.subject = ''
  form.minutes = 0
  form.createdAt = new Date().toISOString()
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-6">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">
      {{ modelValue ? 'Editar Estudo' : 'Novo Estudo' }}
    </h2>
    <form @submit.prevent="submit" class="space-y-4">
      <div class="flex flex-col gap-2">
        <label for="title" class="font-medium text-gray-700 text-sm">Título</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          placeholder="Ex: Aula de React"
          required
          class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="subject" class="font-medium text-gray-700 text-sm">Matéria</label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          placeholder="Ex: Programação"
          required
          class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="minutes" class="font-medium text-gray-700 text-sm">Minutos</label>
        <input
          id="minutes"
          v-model.number="form.minutes"
          type="number"
          min="1"
          placeholder="60"
          required
          class="px-4 py-3 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-purple-600 transition-colors"
        />
      </div>

      <button
        type="submit"
        class="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] hover:shadow-lg"
      >
        {{ modelValue ? 'Atualizar' : 'Salvar' }}
      </button>
    </form>
  </div>
</template>
