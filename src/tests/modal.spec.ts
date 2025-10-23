import { mount } from '@vue/test-utils'
import modal from '@/components/modal/modal.vue'
import { describe, it, expect } from 'vitest'

describe('modal.vue', () => {
  it('closes modal when pressed', async () => {
    const wrapper = mount(modal, {
      global: {
        stubs: {
          teleport: true,
        },
      },
    })

    await wrapper.find('button[data-test="close"]').trigger('click')

    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted('close')?.length).toBe(1)
  })
  describe('modal.vue', () => {
    it('emits close event when modal background is clicked', async () => {
      const wrapper = mount(modal, {
        global: {
          stubs: {
            teleport: true,
          },
        },
      })

      const background = wrapper.find('.modal-background')
      expect(background.exists()).toBe(true)

      await background.trigger('click')

      expect(wrapper.emitted()).toHaveProperty('close')
      expect(wrapper.emitted('close')?.length).toBe(1)
    })
  })
})
