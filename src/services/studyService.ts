// services/studyService.ts
import type { Study } from '@/types/Study'

const STORAGE_KEY = 'studies'

export function getStudies(): Study[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? (JSON.parse(data) as Study[]) : []
}

export function createStudy(
  study: Omit<Study, 'id'>
): Study {
  const studies = getStudies()

  const newStudy: Study = {
    ...study,
    id: crypto.randomUUID()
  }

  studies.push(newStudy)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(studies))

  return newStudy
}

export function updateStudy(
  id: string,
  data: Partial<Omit<Study, 'id'>>
): Study | undefined {
  const studies = getStudies().map(study =>
    study.id === id ? { ...study, ...data } : study
  )

  localStorage.setItem(STORAGE_KEY, JSON.stringify(studies))
  return studies.find(study => study.id === id)
}

export function deleteStudy(id: string): void {
  const studies = getStudies().filter(study => study.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(studies))
}
