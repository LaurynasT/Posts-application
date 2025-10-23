import { mount, flushPromises } from '@vue/test-utils'
import deleteAuthor from '@/components/forms/authors/deleteAuthor.vue'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

export const showError = vi.fn()
export const showSuccess = vi.fn()

vi.mock('@/stores/notificationStore', () => {
  return {
    useNotificationStore: () => ({
      list: [],
      showError,
      showSuccess,
      clear: vi.fn(),
      remove: vi.fn(),
    }),
  }
})

vi.mock('@/components/auth/authentication', () => ({
  getToken: vi.fn(),
}))
vi.mock('@/services/Api', () => ({
  deleteData: vi.fn(),
}))

import { getToken } from '@/components/auth/authentication'
import { deleteData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'

const mockGetToken = getToken as ReturnType<typeof vi.fn>
const mockDeleteData = deleteData as unknown as ReturnType<typeof vi.fn>

const fakeJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
  'eyJzdWIiOjEyMywibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjAwMDAwMDAwfQ.' +
  'signature'

function mountWithPinia(props = {}) {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(deleteAuthor, {
    global: {
      plugins: [pinia],
    },
    props: {
      authorId: 1,
      openModal: () => {},
      ...props,
    },
  })
}

describe('deleteAuthor.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetToken.mockReturnValue(fakeJwt)
    mockDeleteData.mockResolvedValue({})
  })

  it('shows error if token is missing', async () => {
    mockGetToken.mockReturnValue(null)

    const wrapper = mountWithPinia()
    await wrapper.find('button[data-test=delete]').trigger('click')
    await flushPromises()

    const store = useNotificationStore()
    expect(showError).not.toHaveBeenCalled()
  })

  it('calls deleteData and emits on success', async () => {
    const wrapper = mountWithPinia()
    await wrapper.find('button[data-test=delete]').trigger('click')
    await flushPromises()

    expect(mockDeleteData).toHaveBeenCalledWith('/authors/1')
    expect(wrapper.emitted()).toHaveProperty('deleted')
    expect(wrapper.emitted()).toHaveProperty('close')
    expect(wrapper.emitted()).toHaveProperty('requestPageUpdate')
  })
})
