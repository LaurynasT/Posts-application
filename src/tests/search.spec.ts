import { mount } from '@vue/test-utils'
import SearchInput from '@/components/search/search.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('SearchInput.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('debounces and emits update:search after 500ms', async () => {
    const wrapper = mount(SearchInput)

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    await input.setValue('test')

    expect(wrapper.emitted('update:search')).toBeFalsy()

    vi.advanceTimersByTime(500)

    expect(wrapper.emitted('update:search')).toBeTruthy()
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['test'])

    vi.useRealTimers()
  })
})
