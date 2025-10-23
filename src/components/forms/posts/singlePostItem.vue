<script setup lang="ts">
import type { Posts } from '@/Interfaces/posts'
import { useRouter } from 'vue-router'
import { useAuthState } from '@/components/auth/authentication'
import EditPost from './editPost.vue'
import DeletePost from './deletePost.vue'
import { useNotificationStore } from '@/stores/notificationStore'

const router = useRouter()
const loggedIn = useAuthState()
const store = useNotificationStore()
const emit = defineEmits(['deleted', 'close'])

const props = defineProps<{
  post: Posts | null
  openModal: (component: any, props?: Record<string, any>) => void
  refreshPosts: () => void
}>()

function editPost() {
  props.openModal(EditPost, {
    postId: props.post?.id,
    posts: props.post,
    onCreated: () => {
      props.refreshPosts()
    },
  })
}
function deletePost() {
  props.openModal(DeletePost, {
    postId: props.post?.id,
    onDeleted: () => {
      router.push({ name: 'postList' })
    },
  })
}
function goBack() {
  router.push({ name: 'postList' })
}

function newer(post: Posts | null): boolean {
  if (!post?.created_at || !post?.updated_at) return false
  return new Date(post.updated_at) > new Date(post.created_at)
}
</script>

<template>
  <button data-test="back" class="button is-medium is-rounded mt-1" @click="goBack">&lt;</button>

  <div>
    <h2 class="title is-size-8">Post</h2>
    <div>
      <div class="box">
        <h1 class="title is-size-4">Title:</h1>
        <p>{{ post?.title }}</p>
      </div>
      <div class="box">
        <h3 class="title is-size-4">Body</h3>
        <p>{{ post?.body }}</p>
      </div>
      <div class="box">
        <p><strong>Author:</strong> {{ post?.author?.name }} {{ post?.author?.surname }}</p>
      </div>
      <div class="box">
        <div v-if="newer(post)">
          <strong>Updated at: </strong>
          <p>{{ post?.updated_at }}</p>
        </div>
        <div v-else>
          <strong>Created at: </strong>
          <p>{{ post?.created_at }}</p>
        </div>
      </div>
      <div v-if="loggedIn" class="buttons is-pulled-right mr-2">
        <button data-test="edit" class="button is-success" @click="editPost">Edit</button>
        <button data-test="delete" class="button is-danger" @click="deletePost">Delete</button>
      </div>
    </div>
  </div>
</template>
