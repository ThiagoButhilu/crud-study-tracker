<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStudyStore } from '@/stores/studyStore'
import StudyForm from '@/components/studyForm.vue'
import StudyList from '@/components/studyList.vue'
import type { Study } from '@/types/Study'

const store = useStudyStore()

// id do estudo que está sendo editado
const editingId = ref<string | null>(null)

// estudo atual em edição (ou null)
const currentStudy = computed<Omit<Study, 'id'> | null>(() => {
  if (!editingId.value) return null

  const study = store.studies.find(s => s.id === editingId.value)
  if (!study) return null

  const { id, ...rest } = study
  return rest
})

onMounted(() => {
  store.loadStudies()
})

function handleSubmit(data: Omit<Study, 'id'>) {
  if (editingId.value) {
    store.editStudy(editingId.value, data)
    editingId.value = null
  } else {
    store.addStudy(data)
  }
}

function handleEdit(id: string) {
  editingId.value = id
}

function handleDelete(id: string) {
  store.removeStudy(id)

  // se deletar o item que estava sendo editado
  if (editingId.value === id) {
    editingId.value = null
  }
}
</script>

<template>
  <section class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-800 mb-8 text-center">Study Tracker</h1>

      <StudyForm
        :model-value="currentStudy || undefined"
        @submit="handleSubmit"
        class="mb-8"
      />

      <StudyList
        :studies="store.studies"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>
  </section>
</template>
