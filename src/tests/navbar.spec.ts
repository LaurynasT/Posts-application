import { mount } from '@vue/test-utils'
import Navbar from '@/components/navigation/navbar.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/components/auth/authentication', () => {
  return {
    useAuthState: vi.fn(),
    removeToken: vi.fn(),
  }
})

import { useAuthState, removeToken } from '@/components/auth/authentication'
import { createRouter, createMemoryHistory } from 'vue-router'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/login', component: { template: '<div>Login</div>' } },
    { path: '/posts', component: { template: '<div>Posts</div>' } },
    { path: '/authors', component: { template: '<div>Authors</div>' } },
  ],
})
describe('navbar.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows Login link when not logged in', async () => {
    ;(useAuthState as any).mockReturnValue(false)

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Login')
    expect(wrapper.text()).not.toContain('Logout')
  })

  it('shows Logout link when logged in', async () => {
    ;(useAuthState as any).mockReturnValue(true)

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Logout')
    expect(wrapper.text()).not.toContain('Login')
  })

  it('logs out and redirects to /login on Logout click', async () => {
    ;(useAuthState as any).mockReturnValue(true)

    const push = vi.spyOn(router, 'push')

    const wrapper = mount(Navbar, {
      global: {
        plugins: [router],
      },
    })

    const logoutLink = wrapper.find('a[data-test=logout]')
    expect(logoutLink.exists()).toBe(true)

    await logoutLink.trigger('click')

    expect(removeToken).toHaveBeenCalled()
    expect(push).toHaveBeenCalledWith('/login')
  })
})
