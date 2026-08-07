import { ref, computed, type ComputedRef } from 'vue'

export type Lang = 'es' | 'en'

export const lang = ref<Lang>('es')

export function toggleLang() {
  lang.value = lang.value === 'es' ? 'en' : 'es'
}

export const isEs = computed(() => lang.value === 'es')

// Helper: returns a computed that resolves the es/en value based on current lang
export function t<T>(es: T, en: T): ComputedRef<T> {
  return computed(() => (lang.value === 'es' ? es : en))
}
