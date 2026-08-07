import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'
import BootScreen from '../components/BootScreen.vue'

describe('App.vue', () => {
  it('monta sin errores y muestra la secuencia de arranque', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(BootScreen).exists()).toBe(true)
  })
})
