import type { Authors } from './authors'

export interface Posts {
  id: number
  title: string
  body: string
  authorId: number
  created_at: Date
  updated_at: Date
  author?: Authors
}
