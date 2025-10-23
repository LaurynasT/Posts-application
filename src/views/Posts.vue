<template>
  <h1 class="title is-size-4 has-text-centered mt-2">Posts</h1>
  <Search @update:search="handleSearch" />
  <div v-if="loggedIn" class="buttons is-right">
    <button class="button is-link my-2 mr-2" @click="handleCreatePost" :posts="posts">
      Create
    </button>
  </div>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else>
    <div v-if="posts.length === 0">
      <div class="section has-text-centered">
        <p class="title is-5 mb-2">Sorry, there are no Posts.</p>
      </div>
    </div>
    <div v-else>
      <PostList
        :posts="posts"
        :openModal="props.openModal"
        :refreshPosts="refreshPosts"
        @check-pagination="handlePaginationCorrection"
      />
    </div>
  </div>
  <div v-if="posts.length > 0 && !serverDown">
    <Pagination @update:page="onPageChange" :page="page" :total-pages="totalPages" />
  </div>
</template>

<script setup lang="ts">
import PostList from '@/components/forms/posts/postList.vue'
import { fetchData } from '@/services/Api'
import { onUnmounted, ref, watch } from 'vue'
import type { Posts } from '@/Interfaces/posts'
import { useNotificationStore } from '@/stores/notificationStore'
import Pagination from '@/components/pagination/paginations.vue'
import Search from '@/components/search/search.vue'
import { useAuthState } from '@/components/auth/authentication'
import CreatePost from '@/components/forms/posts/createPost.vue'

const posts = ref<Posts[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const store = useNotificationStore()
const page = ref(1)
const pageSize = 2
const searchQuery = ref('')
const loggedIn = useAuthState()
const totalPages = ref(1)
const loaded = ref(false)
const serverDown = ref(false)
const refreshKey = ref(0)

let retryIntervalId: ReturnType<typeof setInterval> | null = null

const props = defineProps<{
  openModal: (component: any, props?: Record<string, any>) => void
}>()

function refreshPosts() {
  refreshKey.value++
}

function handlePaginationCorrection() {
  if (posts.value.length === 1 && page.value > 1) {
    page.value--
  } else {
    refreshPosts()
  }
}

function handleCreatePost() {
  props.openModal(CreatePost, {
    onCreated: () => {
      refreshPosts()
    },
  })
}
function handleSearch(query: string) {
  searchQuery.value = query
  page.value = 1
}

function onPageChange(newPage: number) {
  page.value = newPage
}

async function loadPosts() {
  loading.value = true
  try {
    const res = await fetchData<Posts[]>(`/posts`, undefined, {
      _expand: 'author',
      q: searchQuery.value || undefined,
      _page: page.value,
      _limit: pageSize,
    })
    posts.value = res.data
    totalPages.value = Math.max(1, Math.ceil(res.totalCount / pageSize))
    if (!loaded.value) {
      store.showSuccess('Posts successfully loaded')
      loaded.value = true
    }
    error.value = null
    serverDown.value = false

    if (retryIntervalId) {
      clearInterval(retryIntervalId)
      retryIntervalId = null
      store.showSuccess('Server is back online.')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to Load'
    store.showError(error.value!)
    serverDown.value = true
    if (!retryIntervalId) {
      store.showError('Server disconnected. Retrying...')
      retryIntervalId = setInterval(() => {
        loadPosts()
      }, 5000)
    }
  } finally {
    loading.value = false
  }
}

watch(
  [searchQuery, page, refreshKey],
  () => {
    loadPosts()
  },
  { immediate: true },
)
onUnmounted(() => {
  if (retryIntervalId) {
    clearInterval(retryIntervalId)
  }
})
</script>
