import { ref, computed } from 'vue'

export const lang = ref('es')

export function toggleLang() {
  lang.value = lang.value === 'es' ? 'en' : 'es'
}

export const isEs = computed(() => lang.value === 'es')

// Helper: returns a computed that resolves the es/en value based on current lang
export function t(es, en) {
  return computed(() => (lang.value === 'es' ? es : en))
}
