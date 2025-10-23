<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { patchData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Posts } from '@/Interfaces/posts'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/Interfaces/jwtPayload'
import { getToken } from '@/components/auth/authentication'

const title = ref('')
const body = ref('')
const store = useNotificationStore()
const emit = defineEmits(['created', 'close', 'requestPageUpdate'])
const MIN_LENGTH = 2
const MAX_LENGTH = 20
const MAX_LENGTHPOST = 1000

const props = defineProps<{
  posts: Posts
  postId: number
  component: any
  props?: Record<string, any>
}>()

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

watch(
  () => props.posts,
  (post) => {
    if (post) {
      title.value = post.title
      body.value = post.body
    }
  },
  { immediate: true },
)

async function editPost() {
  try {
    const titles = title.value.trim()
    const bodys = body.value.trim()

    if (titles.length < MIN_LENGTH || bodys.length < MIN_LENGTH) {
      throw new Error(`Title and Body must be at least ${MIN_LENGTH} characters`)
    }
    if (titles.length > MAX_LENGTH || bodys.length > MAX_LENGTHPOST) {
      throw new Error(
        `Title cannot exceed ${MAX_LENGTH} characters and Body cannot exceed ${MAX_LENGTHPOST}`,
      )
    }
    const userId = getUserIdFromJWT()
    if (!userId) throw new Error('User ID not found in token')

    await patchData(`/posts/${props.postId}`, {
      title: titles,
      body: bodys,
      userId,
      updated_at: new Date().toISOString().split('.')[0] + 'Z',
    })
    store.showSuccess('Post edited successfully')
    emit('close')
    emit('created')
    emit('requestPageUpdate')
  } catch (err: any) {
    store.showError(err.message || 'Failed to edit post')
  }
}
</script>

<template>
  <div>
    <h1 class="title">Edit Post Id {{ postId }}</h1>
    <div>
      <form @submit.prevent="editPost">
        <input
          v-model="title"
          class="input mb-4"
          type="title"
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
          <button class="button mt-4" type="submit">Submit</button>
        </div>
      </form>
    </div>
  </div>
</template>
