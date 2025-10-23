<script setup lang="ts">
import type { Authors } from '@/Interfaces/authors'
import AuthorItem from './authorItem.vue'

const props = defineProps<{
  authors: Authors[]
  openModal: (component: any, props?: Record<string, any>) => void
}>()
</script>

<template>
  <div>
    <div>
      <AuthorItem
        v-for="author in authors"
        :key="author.id"
        :author="author"
        :openModal="props.openModal"
        @refresh="$emit('refresh')"
        @check-pagination="$emit('check-pagination')"
        data-test="author-item"
      />
    </div>
  </div>
</template>
