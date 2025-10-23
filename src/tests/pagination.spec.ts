import { mount } from '@vue/test-utils'
import { describe, test, expect, vi } from 'vitest'
import Paginations from '@/components/pagination/paginations.vue'

describe('paginations.vue', () => {
  test('disables Prev button on first page', () => {
    const wrapper = mount(Paginations, {
      props: {
        page: 1,
        totalPages: 5,
      },
    })

    const prevButton = wrapper.get('button:first-of-type')
    expect(prevButton.attributes('disabled')).toBeDefined()
  })

  test('disables Next button on last page', () => {
    const wrapper = mount(Paginations, {
      props: {
        page: 5,
        totalPages: 5,
      },
    })

    const nextButton = wrapper.get('button:last-of-type')
    expect(nextButton.attributes('disabled')).toBeDefined()
  })

  test('emits update:page with +1 when Next is clicked', async () => {
    const wrapper = mount(Paginations, {
      props: {
        page: 2,
        totalPages: 5,
      },
    })

    const nextButton = wrapper.get('button:last-of-type')
    await nextButton.trigger('click')

    expect(wrapper.emitted('update:page')).toBeTruthy()
    expect(wrapper.emitted('update:page')![0]).toEqual([3])
  })

  test('emits update:page with -1 when Prev is clicked', async () => {
    const wrapper = mount(Paginations, {
      props: {
        page: 3,
        totalPages: 5,
      },
    })

    const prevButton = wrapper.get('button:first-of-type')
    await prevButton.trigger('click')

    expect(wrapper.emitted('update:page')).toBeTruthy()
    expect(wrapper.emitted('update:page')![0]).toEqual([2])
  })
})
