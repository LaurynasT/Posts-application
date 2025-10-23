import { mount, flushPromises } from '@vue/test-utils'
import editPost from '@/components/forms/posts/editPost.vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createPinia } from 'pinia'

vi.mock('@/components/auth/authentication', () => ({
  getToken: vi.fn(),
}))

vi.mock('@/services/Api', () => ({
  patchData: vi.fn(),
}))

import { getToken } from '@/components/auth/authentication'
import { patchData } from '@/services/Api'

const mockGetToken = getToken as ReturnType<typeof vi.fn>
const mockPatchData = patchData as unknown as ReturnType<typeof vi.fn>

const fakeJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOjEyMywibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjAwMDAwMDAwfQ.' +
  'signature'

const mockPost = {
  id: 1,
  title: 'Mock Post Title',
  body: 'Mock Post Body',
  userId: 1,
  authorId: 1,
  created_at: new Date('2025-12-12'),
  updated_at: new Date('2025-12-12'),
}

const mockComponent = {}

function mountWithPinia(props = {}) {
  return mount(editPost, {
    global: {
      plugins: [createPinia()],
    },
    props: {
      postId: 1,
      posts: mockPost,
      component: mockComponent,
      ...props,
    },
  })
}

describe('editPost.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetToken.mockReturnValue(fakeJwt)
    mockPatchData.mockResolvedValue({})
  })

  it('shows error if Title or Content is too short', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('a')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('a')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })

  it('shows error if token is missing', async () => {
    mockGetToken.mockReturnValue(null)
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Second Post')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Lorem Ipsum')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })

  it('calls patchData and emits on success', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Second Post')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Lorem Ipsum')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).toHaveBeenCalledWith('/posts/1', expect.any(Object))
    expect(wrapper.emitted()).toHaveProperty('created')
    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted()).toHaveProperty('requestPageUpdate')
  })

  it('shows error if Title exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('a'.repeat(21))
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('Valid body')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })

  it('shows error if content exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Title"]').setValue('Valid Title')
    await wrapper.find('textarea[placeholder="Add Content"]').setValue('a'.repeat(1001))
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })
})
