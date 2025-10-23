<script setup lang="ts">
import { deleteData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'

const store = useNotificationStore()
const props = defineProps<{
  authorId: number
  openModal: (component: any, props?: Record<string, any>) => void
}>()
const emit = defineEmits(['close', 'deleted', 'requestPageUpdate'])

async function deleteAuthor() {
  try {
    await deleteData(`/authors/${props.authorId}`)
    store.showSuccess('Author successfully deleted')
    emit('deleted')
    emit('close')
    emit('requestPageUpdate')
  } catch (err: any) {
    store.showError(err)
  }
}
</script>

<template>
  <div>
    <h1 class="is-size-5 has-text-centered">Are you sure you want to delete this author?</h1>
  </div>
  <div class="is-flex is-justify-content-flex-end mt-5">
    <button data-test="delete" class="button is-success mr-4" @click="deleteAuthor()">Yes</button>
    <button class="button is-danger" @click="emit('close')">No</button>
  </div>
</template>
