import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import singlePostItem from '@/components/forms/posts/singlePostItem.vue'
import { createRouter, createWebHistory } from 'vue-router'

vi.mock('@/components/auth/authentication', () => ({
  useAuthState: () => true,
}))

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/posts', name: 'postList', component: { template: '<div>Posts</div>' } }],
})

describe('singlePostItem.vue', () => {
  const defaultPost = {
    id: 1,
    title: 'First Post',
    authorId: 1,
    body: 'Lorem Ipsum',
    created_at: new Date('2025-12-12'),
    updated_at: new Date('2025-12-13'),
  }

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const factory = (post = defaultPost) =>
    mount(singlePostItem, {
      global: {
        plugins: [router],
      },
      props: {
        post,
        openModal: vi.fn(),
        refreshPosts: vi.fn(),
      },
    })

  it('renders post title and body', () => {
    const wrapper = factory()
    expect(wrapper.text()).toContain('First Post')
    expect(wrapper.text()).toContain('Lorem Ipsum')
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
    const editButton = wrapper.find('button[data-test=edit]')
    const deleteButton = wrapper.find('button[data-test=delete]')
    expect(editButton.text()).toBe('Edit')
    expect(deleteButton.text()).toBe('Delete')
  })

  it('calls openModal with EditPost component on edit click', async () => {
    const openModal = vi.fn()
    const wrapper = mount(singlePostItem, {
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
    const wrapper = mount(singlePostItem, {
      props: {
        post: defaultPost,
        openModal,
        refreshPosts: vi.fn(),
      },
    })
    await wrapper.find('button.button.is-danger').trigger('click')
    expect(openModal).toHaveBeenCalled()
  })
  it('back button goes back to posts page', () => {
    const routerPush = vi.spyOn(router, 'push')
    const wrapper = factory()
    const backButton = wrapper.find('button[data-test=back]')
    backButton.trigger('click')

    expect(routerPush).toHaveBeenCalledWith({ name: 'postList' })
  })
})
