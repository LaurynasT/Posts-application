<template>
  <div class="box my-1">
    <div
      class="is-flex is-justify-content-space-between is-align-items-center is-clickable"
      @click="goToPost(post)"
    >
      <div style="flex: 1 1 0">
        <div style="max-width: 400px">
          <h1 class="is-ellipsis has-text-weight-semibold"><strong>Title: </strong></h1>
          <p class="is-ellipsis">{{ post.title }}</p>
          <h1 class="is-ellipsis has-text-weight-semibold"><strong>Author: </strong></h1>
          <p class="is-ellipsis">{{ post.author?.name }} {{ post.author?.surname }}</p>
        </div>
      </div>
      <div class="has-text-right mx-3">
        <div v-if="newer(post)">
          <strong>Updated at: </strong>
          <p>{{ post.updated_at }}</p>
        </div>
        <div v-else>
          <strong>Created at: </strong>
          <p>{{ post.created_at }}</p>
        </div>
      </div>
    </div>
    <div v-if="loggedIn" class="buttons is-right" style="flex-shrink: 0">
      <button class="button is-success mr-1" @click="editPost">Edit</button>
      <button class="button is-danger" @click="deletePost">Delete</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Posts } from '@/Interfaces/posts'
import { useRouter } from 'vue-router'
import { useAuthState } from '@/components/auth/authentication'
import EditPost from './editPost.vue'
import DeletePost from './deletePost.vue'

const router = useRouter()
const loggedIn = useAuthState()
const emit = defineEmits(['refresh', 'check-pagination'])

const props = defineProps<{
  post: Posts
  openModal: (component: any, props?: Record<string, any>) => void
  refreshPosts: () => void
}>()

function editPost() {
  props.openModal(EditPost, {
    postId: props.post.id,
    posts: props.post,
    onCreated: () => {
      props.refreshPosts()
    },
    onRequestPageUpdate: () => {
      emit('check-pagination')
    },
  })
}

function deletePost() {
  props.openModal(DeletePost, {
    postId: props.post.id,
    onDeleted: () => {
      props.refreshPosts()
    },
    onRequestPageUpdate: () => {
      emit('check-pagination')
    },
  })
}
function newer(post: Posts): boolean {
  return new Date(post.updated_at) > new Date(post.created_at)
}

function goToPost(post: Posts) {
  router.push({ name: 'singlePost', params: { id: post.id } })
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
