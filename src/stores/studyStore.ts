// stores/studyStore.ts
import { defineStore } from 'pinia'
import type { Study } from '@/types/Study'
import * as studyService from '@/services/studyService'

export const useStudyStore = defineStore('study', {
  state: () => ({
    studies: [] as Study[]
  }),

  actions: {
    loadStudies(): void {
      this.studies = studyService.getStudies()
    },

    addStudy(data: Omit<Study, 'id'>): void {
      const study = studyService.createStudy(data)
      this.studies.push(study)
    },

    editStudy(
      id: string,
      data: Partial<Omit<Study, 'id'>>
    ): void {
      const updated = studyService.updateStudy(id, data)
      if (!updated) return

      const index = this.studies.findIndex(s => s.id === id)
      if (index !== -1) {
        this.studies[index] = updated
      }
    },

    removeStudy(id: string): void {
      studyService.deleteStudy(id)
      this.studies = this.studies.filter(s => s.id !== id)
    }
  }
})
