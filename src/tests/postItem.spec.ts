import { mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import postItem from '@/components/forms/posts/postItem.vue'

vi.mock('@/components/auth/authentication', () => ({
  useAuthState: () => true,
}))

describe('postItem.vue', () => {
  const defaultPost = {
    id: 1,
    title: 'First Post',
    authorId: 1,
    body: '',
    created_at: new Date('2025-12-12'),
    updated_at: new Date('2025-12-13'),
  }

  const factory = (post = defaultPost) =>
    mount(postItem, {
      props: {
        post,
        openModal: vi.fn(),
        refreshPosts: vi.fn(),
      },
    })

  it('renders post title ', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('First Post')
  })

  it('renders "Updated at" if updated_at > created_at', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('Updated at:')
    expect(wrapper.text()).toContain(new Date('2025-12-13').toDateString())
  })

  it('renders "Created at" if updated_at <= created_at', () => {
    const author = {
      ...defaultPost,
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
  it('calls openModal with EditPost component on edit click', async () => {
    const openModal = vi.fn()
    const wrapper = mount(postItem, {
      props: {
        post: defaultPost,
        openModal,
        refreshPosts: vi.fn(),
      },
    })
    await wrapper.find('button.button.is-success').trigger('click')
    expect(openModal).toHaveBeenCalled()
  })
  it('calls openModal with deletePost component on delete click', async () => {
    const openModal = vi.fn()
    const wrapper = mount(postItem, {
      props: {
        post: defaultPost,
        openModal,
        refreshPosts: vi.fn(),
      },
    })
    await wrapper.find('button.button.is-danger').trigger('click')
    expect(openModal).toHaveBeenCalled()
  })
})
