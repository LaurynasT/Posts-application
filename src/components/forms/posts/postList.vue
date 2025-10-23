<template>
  <div>
    <div>
      <postItem
        v-for="post in posts"
        :key="post.id"
        :post="post"
        :openModal="openModal"
        :refreshPosts="refreshPosts"
        @check-pagination="$emit('check-pagination')"
        data-test="post-item"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import postItem from './postItem.vue'
import type { Posts } from '@/Interfaces/posts'

defineProps<{
  posts: Posts[]
  openModal: (component: any, props?: Record<string, any>) => void
  refreshPosts: () => void
}>()
</script>
