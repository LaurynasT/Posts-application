<script setup lang="ts">
import { postData, fetchData } from '@/services/Api'
import type { Posts } from '@/Interfaces/posts'
import { onMounted, ref } from 'vue'
import type { Authors } from '@/Interfaces/authors'
import { useNotificationStore } from '@/stores/notificationStore'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/Interfaces/jwtPayload'
import { getToken } from '@/components/auth/authentication'

const title = ref('')
const body = ref('')
const authorId = ref('')
const authors = ref<Authors[]>()
const store = useNotificationStore()
const emit = defineEmits(['created', 'close'])
const MIN_LENGTH = 2
const MAX_LENGTH = 20
const MAX_LENGTHPOST = 1000

function getUserIdFromJWT(): number | null {
  const token = getToken()
  if (!token) return null
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    return decoded.sub ?? null
  } catch (e) {
    store.showError('Invalid token')
    return null
  }
}

onMounted(async () => {
  try {
    const res = await fetchData<Authors[]>('/authors')
    authors.value = res.data
  } catch (err: any) {
    store.showError(err)
  }
})

async function createPost() {
  try {
    const titles = title.value.trim()
    const bodys = body.value.trim()

    if (titles.length < MIN_LENGTH || bodys.length < MIN_LENGTH) {
      throw new Error(`Title and Body must be at least ${MIN_LENGTH} charachters`)
    }
    if (titles.length > MAX_LENGTH || bodys.length > MAX_LENGTHPOST) {
      throw new Error(
        `Title cannot exceed ${MAX_LENGTH} charachters and Body cannot exceed ${MAX_LENGTHPOST}`,
      )
    }

    const userId = getUserIdFromJWT()
    if (!userId) throw new Error('User ID not found in token')

    await postData<Posts>('/posts', {
      title: titles,
      body: bodys,
      authorId: authorId.value,
      userId,
      created_at: new Date().toISOString().split('.')[0] + 'Z',
      updated_at: new Date().toISOString().split('.')[0] + 'Z',
    })
    emit('created')
    emit('close')
    store.showSuccess('Post successfully created')
  } catch (err: any) {
    store.showError(err)
  }
}
</script>

<template>
  <div>
    <div>
      <h1 class="title">Create Post</h1>
      <form class="mt-4" @submit.prevent="createPost">
        <input
          v-model="title"
          class="input mt-4"
          type="input"
          placeholder="Title"
          :minlength="MIN_LENGTH"
          :maxlength="MAX_LENGTH"
          required
        />
        <textarea
          v-model="body"
          class="textarea is-large mt-4"
          placeholder="Add Content"
          :minlength="MIN_LENGTH"
          :maxlength="MAX_LENGTHPOST"
        ></textarea>
        <div>
          <select v-model="authorId" class="select mt-4" required>
            <option disabled value="">Select Author</option>
            <option v-for="author in authors" :key="author.id" :value="author.id">
              {{ author.name }} {{ author.surname }}
            </option>
          </select>
        </div>
        <button class="button mt-4" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>
