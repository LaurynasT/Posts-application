<script setup lang="ts">
import { deleteData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'

const store = useNotificationStore()
const props = defineProps<{
  postId: number
  openModal: (component: any, props?: Record<string, any>) => void
}>()
const emit = defineEmits(['close', 'deleted', 'requestPageUpdate'])

async function deletePost() {
  try {
    await deleteData(`/posts/${props.postId}`)
    emit('close')
    emit('requestPageUpdate')
    emit('deleted')
    store.showSuccess('Post successfully deleted')
  } catch (err: any) {
    store.showError(err)
  }
}
</script>

<template>
  <div>
    <h1 class="is-size-5 has-text-centered">Are you sure you want to delete this Post?</h1>
  </div>
  <div class="is-flex is-justify-content-flex-end mt-5">
    <button data-test="delete" class="button is-success mr-4" @click="deletePost()">Yes</button>
    <button class="button is-danger" @click="emit('close')">No</button>
  </div>
</template>
