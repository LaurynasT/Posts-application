import { describe, it, expect, beforeEach } from 'vitest'
import { ref, nextTick, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'


import { loggedIn, setToken, removeToken, refreshAuth, useAuthState } from '@/components/auth/authentication'

describe('auth.ts', () => {
  beforeEach(() => {
    localStorage.clear()
    removeToken() 
  })

  it('initializes loggedIn from localStorage', () => {
    localStorage.setItem('access_token', 'abc')
    refreshAuth()
    expect(loggedIn.value).toBe(true)
  })

  it('setToken stores token and sets loggedIn true', () => {
    setToken('token123')
    expect(localStorage.getItem('access_token')).toBe('token123')
    expect(loggedIn.value).toBe(true)
  })

  it('removeToken removes token and sets loggedIn false', () => {
    setToken('token123')
    removeToken()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(loggedIn.value).toBe(false)
  })

  it('reacts to storage event changes', async () => {
    const dummy = defineComponent({
      setup() {
        const loggedInState = useAuthState()
        return { loggedInState }
      },
      template: `<div>{{ loggedInState }}</div>`
    })

    const wrapper = mount(dummy)

    
    expect(wrapper.vm.loggedInState).toBe(false)

   
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      newValue: 'token-abc',
    }))

    await nextTick()
    expect(wrapper.vm.loggedInState).toBe(true)


    window.dispatchEvent(new StorageEvent('storage', {
      key: 'access_token',
      newValue: null,
    }))

    await nextTick()
    expect(wrapper.vm.loggedInState).toBe(false)

    wrapper.unmount()
  })
})
