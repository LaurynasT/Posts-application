import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import NotificationItem from '@/components/notifications/notificationItem.vue'

describe('NotificationItem.vue', () => {
  const notification = {
    id: 'abc123',
    message: 'This is a test notification',
    type: 'success' as const,
  }

  it('renders the notification message', () => {
    const wrapper = mount(NotificationItem, {
      props: {
        notification,
        remove: vi.fn(),
      },
    })

    expect(wrapper.text()).toContain('This is a test notification')
  })

  it('applies correct class for success notification', () => {
    const wrapper = mount(NotificationItem, {
      props: {
        notification,
        remove: vi.fn(),
      },
    })

    expect(wrapper.classes()).toContain('notification')
    expect(wrapper.classes()).toContain('is-success')
  })

  it('applies correct class for error notification', () => {
    const wrapper = mount(NotificationItem, {
      props: {
        notification: { ...notification, type: 'error' },
        remove: vi.fn(),
      },
    })

    expect(wrapper.classes()).toContain('is-danger')
  })

  it('calls remove when main notification is clicked', async () => {
    const remove = vi.fn()
    const wrapper = mount(NotificationItem, {
      props: {
        notification,
        remove,
      },
    })

    await wrapper.trigger('click')
    expect(remove).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledWith(notification.id)
  })

  it('calls remove when delete button is clicked', async () => {
    const remove = vi.fn()
    const wrapper = mount(NotificationItem, {
      props: {
        notification,
        remove,
      },
    })

    const deleteButton = wrapper.find('button.delete')
    await deleteButton.trigger('click')

    expect(remove).toHaveBeenCalledTimes(1)
    expect(remove).toHaveBeenCalledWith(notification.id)
  })
})
