<script setup lang="ts">
import StudyItem from './studyItem.vue'
import type { Study } from '@/types/Study'

defineProps<{
  studies: Study[]
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Meus Estudos</h2>
    
    <ul v-if="studies.length" class="space-y-4">
      <StudyItem
        v-for="study in studies"
        :key="study.id"
        :study="study"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </ul>

    <div v-else class="bg-white rounded-xl shadow-md p-12 text-center">
      <p class="text-gray-500 text-lg">Nenhum estudo cadastrado ainda</p>
      <p class="text-gray-400 text-sm mt-2">Adicione seu primeiro estudo usando o formulário acima</p>
    </div>
  </div>
</template>
