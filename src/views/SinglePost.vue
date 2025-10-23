<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Posts } from '@/Interfaces/posts'
import { fetchData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'
import singlePostItem from '@/components/forms/posts/singlePostItem.vue'

const route = useRoute()
const post = ref<Posts | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const id = route.params.id
const store = useNotificationStore()
const serverDown = ref(false)
const notFound = ref(false)
const refreshKey = ref(0)

const props = defineProps<{
  openModal: (component: any, props?: Record<string, any>) => void
  refreshPosts: () => void
}>()

let retryIntervalId: ReturnType<typeof setInterval> | null = null

function refreshPost() {
  refreshKey.value++
}

async function loadPost() {
  loading.value = true
  try {
    const res = await fetchData<Posts>('/posts', `${id}`, { _expand: 'author' })
    store.showSuccess('Successfully loaded post')

    post.value = res.data
    error.value = null
    serverDown.value = false
    if (retryIntervalId) {
      clearInterval(retryIntervalId)
      retryIntervalId = null
      store.showSuccess('Server is back online.')
    }
  } catch (err: any) {
    error.value = err.message
    store.showError(err.message)
    if (err.response?.status === 404 || err.response?.data === null) {
      notFound.value = true
      post.value = null
      error.value = null
    } else {
      error.value = err.message
      store.showError(error.value!)
    }
    if (!retryIntervalId) {
      store.showError('Server disconnected. Retrying...')
      retryIntervalId = setInterval(() => {
        loadPost()
      }, 5000)
    }
  } finally {
    loading.value = false
  }
}

onUnmounted(() => {
  if (retryIntervalId) {
    clearInterval(retryIntervalId)
  }
})

watch(
  () => refreshKey.value,
  () => loadPost(),
  { immediate: true },
)
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error" class="is-flex is-justify-content-center mt-5">Error: {{ error }}</div>
    <div v-else-if="notFound">
      <div class="is-flex is-justify-content-center mt-5">
        <div class="section has-text-centered">
          <p class="title is-5 mb-2">Sorry, there's no post with this ID.</p>
          <a href="/posts" class="button is-light mt-2">Go back to Posts</a>
        </div>
      </div>
    </div>
    <div v-else-if="post">
      <singlePostItem :post="post" :openModal="openModal" :refreshPosts="refreshPost" />
    </div>
  </div>
</template>
