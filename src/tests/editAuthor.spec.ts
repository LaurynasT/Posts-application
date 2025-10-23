import { mount, flushPromises } from '@vue/test-utils'
import editAuthor from '@/components/forms/authors/editAuthor.vue'
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

const mockAuthor = {
  id: 1,
  name: 'John',
  surname: 'Doe',
  userId: 1,
  created_at: new Date('2025-12-12'),
  updated_at: new Date('2025-12-12'),
}

const mockComponent = {}

function mountWithPinia(props = {}) {
  return mount(editAuthor, {
    global: {
      plugins: [createPinia()],
    },
    props: {
      authorId: 1,
      authors: mockAuthor,
      component: mockComponent,
      ...props,
    },
  })
}

describe('editAuthor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetToken.mockReturnValue(fakeJwt)
    mockPatchData.mockResolvedValue({})
  })

  it('shows error if name or surname is too short', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('A')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('B')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })

  it('shows error if token is missing', async () => {
    mockGetToken.mockReturnValue(null)
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })

  it('calls patchData and emits on success', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).toHaveBeenCalledWith('/authors/1', expect.any(Object))
    expect(wrapper.emitted()).toHaveProperty('created')
    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted()).toHaveProperty('requestPageUpdate')
  })

  it('shows error if name exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John'.repeat(21))
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })

  it('shows error if surname exceeds max length', async () => {
    const wrapper = mountWithPinia()

    await wrapper.find('input[placeholder="Author Name"]').setValue('John')
    await wrapper.find('input[placeholder="Author Surname"]').setValue('Doe'.repeat(21))
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(mockPatchData).not.toHaveBeenCalled()
  })
})
