import { mount, flushPromises } from '@vue/test-utils'
import CreateAuthor from '@/components/forms/authors/createAuthor.vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createPinia } from 'pinia'

vi.mock('@/components/auth/authentication', () => ({
  getToken: vi.fn(),
}))

vi.mock('@/services/Api', () => ({
  postData: vi.fn(),
}))

import { getToken } from '@/components/auth/authentication'
import { postData } from '@/services/Api'

const mockGetToken = getToken as ReturnType<typeof vi.fn>
const mockPostData = postData as unknown as ReturnType<typeof vi.fn>

const fakeJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOjEyMywibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjAwMDAwMDAwfQ.' +
  'signature'

describe('CreateAuthor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetToken.mockReturnValue(fakeJwt)
    mockPostData.mockResolvedValue({})
  })

  function mountWithPinia() {
    return mount(CreateAuthor, {
      global: {
        plugins: [createPinia()],
      },
    })
  }

  it('shows error if name or surname is too short', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('A')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('B')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })

  it('shows error if token is missing', async () => {
    mockGetToken.mockReturnValue(null)
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })

  it('calls postData and emits on success', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).toHaveBeenCalled()
    expect(wrapper.emitted()).toHaveProperty('created')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('shows error if name exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('J'.repeat(21))
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })

  it('shows error if surname exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('D'.repeat(21))

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })
})
