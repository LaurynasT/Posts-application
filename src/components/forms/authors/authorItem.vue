<template>
  <div class="box my-1">
    <div class="is-flex is-justify-content-space-between is-align-items-center">
      <div class="mr-3" style="flex: 1 1 auto; min-width: 0">
        <div style="max-width: 400px">
          <h1 class="is-ellipsis"><strong>Author: </strong></h1>
          <p class="is-ellipsis">{{ author.name }} {{ author.surname }}</p>
        </div>
      </div>
      <div class="has-text-right mr-3" style="flex-shrink: 0; max-width: 200px">
        <div v-if="newer(author)">
          <strong>Updated at: </strong>
          <p>{{ author.updated_at }}</p>
        </div>
        <div v-else>
          <strong>Created at: </strong>
          <p>{{ author.created_at }}</p>
        </div>
      </div>
      <div v-if="loggedIn" class="buttons" style="flex-shrink: 0">
        <button class="button is-success mr-1" @click="handleEditAuthor(author.id)">Edit</button>
        <button class="button is-danger" @click="deleteAuthor(author.id)">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Authors } from '@/Interfaces/authors'
import { useAuthState } from '@/components/auth/authentication'
import EditAuthor from './editAuthor.vue'
import DeleteAuthor from './deleteAuthor.vue'

const loggedIn = useAuthState()
const emit = defineEmits(['refresh', 'check-pagination'])
const props = defineProps<{
  author: Authors
  openModal: (component: any, props?: Record<string, any>) => void
}>()

function handleEditAuthor(id: number) {
  props.openModal(EditAuthor, {
    authorId: id,
    authors: props.author,
    onCreated: () => {
      emit('refresh')
    },
    onRequestPageUpdate: () => {
      emit('check-pagination')
    },
  })
}
function deleteAuthor(id: number) {
  props.openModal(DeleteAuthor, {
    authorId: id,

    onDeleted: () => {
      emit('refresh')
    },
    onRequestPageUpdate: () => {
      emit('check-pagination')
    },
  })
}

function newer(author: Authors): boolean {
  return new Date(author.updated_at) > new Date(author.created_at)
}
</script>

<style scoped>
.is-ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: block;
}
</style>
