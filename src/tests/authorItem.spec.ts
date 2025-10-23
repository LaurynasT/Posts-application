import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import authorItem from '@/components/forms/authors/authorItem.vue'

vi.mock('@/components/auth/authentication', () => ({
  useAuthState: () => true,
}))

describe('authorItem.vue', () => {
  const defaultAuthor = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    created_at: new Date('2025-12-12'),
    updated_at: new Date('2025-12-13'),
  }

  const factory = (author = defaultAuthor) =>
    mount(authorItem, {
      props: {
        author,
        openModal: vi.fn(),
      },
    })

  it('renders author name and surname', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('John Doe')
  })

  it('renders "Updated at" if updated_at > created_at', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Updated at:')
    expect(wrapper.text()).toContain(new Date('2025-12-13').toDateString())
  })

  it('renders "Created at" if updated_at <= created_at', () => {
    const author = {
      ...defaultAuthor,
      updated_at: new Date('2025-12-12'),
    }
    const wrapper = factory(author)
    expect(wrapper.text()).toContain('Created at:')
    expect(wrapper.text()).toContain(new Date('2025-12-12').toDateString())
  })

  it('shows Edit and Delete buttons if logged in', () => {
    const wrapper = factory()
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(2)
    expect(buttons[0].text()).toBe('Edit')
    expect(buttons[1].text()).toBe('Delete')
  })
  it('calls openModal with EditAuthor component on edit click', async () => {
    const openModal = vi.fn()
    const wrapper = mount(authorItem, {
      props: {
        author: defaultAuthor,
        openModal,
      },
    })
    await wrapper.find('button.button.is-success').trigger('click')
    expect(openModal).toHaveBeenCalled()
  })
  it('calls openModal with deleteAuthor component on delete click', async () => {
    const openModal = vi.fn()
    const wrapper = mount(authorItem, {
      props: {
        author: defaultAuthor,
        openModal,
      },
    })
    await wrapper.find('button.button.is-danger').trigger('click')
    expect(openModal).toHaveBeenCalled()
  })
})
