import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectsSection from '../components/sections/ProjectsSection.vue'

describe('ProjectsSection.vue', () => {
  it('renderiza las cartas de proyectos con su título', () => {
    const wrapper = mount(ProjectsSection)
    const cards = wrapper.findAll('.cartridge-card')
    expect(cards.length).toBeGreaterThan(0)
    expect(wrapper.text()).toContain('INSOMNIS')
  })
})
