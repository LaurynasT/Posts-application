import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import postList from '@/components/forms/posts/postList.vue'

describe('postList.vue', () => {
  const posts = [
    {
      id: 1,
      title: 'First Post',
      authorId: 1,
      body: '',
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
    {
      id: 2,
      title: 'Second Post',
      authorId: 1,
      body: '',
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
    {
      id: 3,
      title: 'Third Post',
      authorId: 2,
      body: '',
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
    {
      id: 4,
      title: 'Third Post',
      authorId: 2,
      body: '',
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
  ]

  it('shows rendered posts length', () => {
    const wrapper = mount(postList, {
      props: {
        posts,
        openModal: vi.fn(),
        refreshPosts: vi.fn(),
      },
    })
    const renderedPosts = wrapper.findAll('div[data-test=post-item]')
    expect(renderedPosts.length).toBe(posts.length)
  })
})
