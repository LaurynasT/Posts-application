import { mount, flushPromises } from '@vue/test-utils'
import createPost from '@/components/forms/posts/createPost.vue'
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

describe('createPost.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetToken.mockReturnValue(fakeJwt)
    mockPostData.mockResolvedValue({})
  })

  function mountWithPinia() {
    return mount(createPost, {
      global: {
        plugins: [createPinia()],
      },
    })
  }

  it('shows error if Title or Content is too short', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('a')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('a')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })

  it('shows error if token is missing', async () => {
    mockGetToken.mockReturnValue(null)
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Second Post')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Lorem Ipsum')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })

  it('calls postData and emits on success', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Second Post')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Lorem Ipsum')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).toHaveBeenCalled()
    expect(wrapper.emitted()).toHaveProperty('created')
    expect(wrapper.emitted()).toHaveProperty('close')
  })

  it('shows error if title exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Second Post'.repeat(21))
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Lorem Ipsum')

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })

  it('shows error if content exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Second Post')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Lorem Ipsum'.repeat(1000))

    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPostData).not.toHaveBeenCalled()
  })
})
