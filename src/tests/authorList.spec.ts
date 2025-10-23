import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import authorList from '@/components/forms/authors/authorList.vue'

describe('authorList.vue', () => {
  const authors = [
    {
      id: 1,
      name: 'John',
      surname: 'Doe',
      userId: 1,
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
    {
      id: 2,
      name: 'John',
      surname: 'Smith',
      userId: 1,
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
    {
      id: 3,
      name: 'John',
      surname: 'Saint',
      userId: 1,
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
    {
      id: 4,
      name: 'John',
      surname: 'God',
      userId: 1,
      created_at: new Date('2025-12-12'),
      updated_at: new Date('2025-12-13'),
    },
  ]

  it('shows rendered authors length', () => {
    const wrapper = mount(authorList, {
      props: {
        authors,
        openModal: vi.fn(),
        refreshPosts: vi.fn(),
      },
    })
    const renderedAuthors = wrapper.findAll('div[data-test=author-item]')
    expect(renderedAuthors.length).toBe(authors.length)
  })
})
