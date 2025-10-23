import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotificationStore } from '@/stores/notificationStore'
import notificationList from '@/components/notifications/notificationList.vue'

describe('notificationList.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows rendered notification length', () => {
    const store = useNotificationStore()

   
    store.list.push( 
      { id: 'abc123', message: 'Error test', type: 'error' },
      { id: 'abc124', message: 'Success test 1', type: 'success' },
      { id: 'abc125', message: 'Success test 2', type: 'success' },
      { id: 'abc126', message: 'Error test 2', type: 'error' }
    )

    const wrapper = mount(notificationList)

    const renderedNotifications = wrapper.findAll('[data-test="notification-item"]')
    expect(renderedNotifications.length).toBe(store.list.length)
  })
})
