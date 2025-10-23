<script setup lang="ts">
import authorList from '@/components/forms/authors/authorList.vue'
import { fetchData } from '../services/Api'
import { useNotificationStore } from '@/stores/notificationStore'
import { onUnmounted, ref, watch } from 'vue'
import type { Authors } from '@/Interfaces/authors'
import Pagination from '@/components/pagination/paginations.vue'
import Search from '@/components/search/search.vue'
import CreateAuthor from '@/components/forms/authors/createAuthor.vue'
import { useAuthState } from '@/components/auth/authentication'

const authors = ref<Authors[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const store = useNotificationStore()
const page = ref(1)
const pageSize = 2
const totalPages = ref(1)
const searchQuery = ref('')
const loggedIn = useAuthState()
const loaded = ref(false)
const serverDown = ref(false)
const refreshKey = ref(0)

let retryIntervalId: ReturnType<typeof setInterval> | null = null

const props = defineProps<{
  openModal: (component: any, props?: Record<string, any>) => void
}>()

function refreshAuthors() {
  refreshKey.value++
}

function handleCreateAuthor() {
  props.openModal(CreateAuthor, {
    onCreated: () => {
      refreshAuthors()
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

function handlePaginationCorrection() {
  if (authors.value.length === 1 && page.value > 1) {
    page.value--
  } else {
    refreshAuthors()
  }
}

async function loadAuthors() {
  loading.value = true
  try {
    const res = await fetchData<Authors[]>('/authors', undefined, {
      q: searchQuery.value || undefined,
      _page: page.value,
      _limit: pageSize,
    })

    authors.value = res.data
    totalPages.value = Math.max(1, Math.ceil(res.totalCount / pageSize))

    if (!loaded.value) {
      store.showSuccess('Authors successfully loaded')
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
    error.value = err.message
    store.showError(error.value ?? 'Failed to load'!)

    serverDown.value = true

    if (!retryIntervalId) {
      store.showError('Server disconnected. Retrying...')
      retryIntervalId = setInterval(() => {
        loadAuthors()
      }, 5000)
    }
  } finally {
    loading.value = false
  }
}

watch(
  [searchQuery, page, refreshKey],
  () => {
    loadAuthors()
  },
  { immediate: true },
)
onUnmounted(() => {
  if (retryIntervalId) {
    clearInterval(retryIntervalId)
  }
})
</script>

<template>
  <h1 class="title is-size-4 has-text-centered mt-2">Authors</h1>
  <Search @update:search="handleSearch" />
  <div v-if="loggedIn" class="buttons is-right">
    <button class="button is-link my-2 mr-2" @click="handleCreateAuthor">Create</button>
  </div>
  <div v-if="loading">Loading</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <div v-else-if="authors.length === 0">
    <div class="section has-text-centered">
      <p class="title is-5 mb-2">Sorry, there are no authors.</p>
    </div>
  </div>
  <div v-else>
    <div>
      <authorList
        :authors="authors"
        :openModal="props.openModal"
        @refresh="refreshAuthors"
        @check-pagination="handlePaginationCorrection"
      />
    </div>
  </div>
  <div v-if="authors.length > 0 && !serverDown">
    <Pagination @update:page="onPageChange" :page="page" :total-pages="totalPages" />
  </div>
</template>
