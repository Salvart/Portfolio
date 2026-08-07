import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NavigationSidebar from '../components/NavigationSidebar.vue'

const menuItems = [
  { id: 1, icon: '❖', name: 'INFO' },
  { id: 2, icon: '✧', name: 'STUDIES' },
]

describe('NavigationSidebar.vue', () => {
  it('renderiza los elementos del menú', () => {
    const wrapper = mount(NavigationSidebar, {
      props: { menuItems, activeIndex: 0 },
    })
    const labels = wrapper.findAll('.menu-label').map((n) => n.text())
    expect(labels).toEqual(['INFO', 'STUDIES'])
  })

  it('emite el evento select al pulsar un botón', async () => {
    const wrapper = mount(NavigationSidebar, {
      props: { menuItems, activeIndex: 0 },
    })
    await wrapper.findAll('.menu-item-btn')[1].trigger('click')
    expect(wrapper.emitted('select')).toEqual([[1]])
  })
})
