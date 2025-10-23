<script setup lang="ts">
import { ref, watch } from 'vue'
import { patchData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'
import type { Authors } from '@/Interfaces/authors'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/Interfaces/jwtPayload'
import { getToken } from '@/components/auth/authentication'

const name = ref('')
const surname = ref('')
const store = useNotificationStore()
const emit = defineEmits(['created', 'close', 'requestPageUpdate'])
const MIN_LENGTH = 2
const MAX_LENGTH = 20

const props = defineProps<{
  authorId: number
  authors: Authors
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
  () => props.authors,
  (author) => {
    if (author) {
      name.value = author.name
      surname.value = author.surname
    }
  },
  { immediate: true },
)

async function editAuthor() {
  try {
    const names = name.value.trim()
    const surnames = surname.value.trim()
    if (names.length < MIN_LENGTH || surnames.length < MIN_LENGTH) {
      throw new Error(`Name and surname must be at least ${MIN_LENGTH} charachters`)
    }
    if (names.length > MAX_LENGTH || surnames.length > MAX_LENGTH) {
      throw new Error(`Name and surname cannot exceed ${MAX_LENGTH} charachters`)
    }
    const userId = getUserIdFromJWT()
    if (!userId) throw new Error('User ID not found in token')

    await patchData(`/authors/${props.authorId}`, {
      name: names,
      surname: surnames,
      userId,
      updated_at: new Date().toISOString().split('.')[0] + 'Z',
    })
    store.showSuccess('Author edited successfully')

    emit('close')
    emit('created')
    emit('requestPageUpdate')
  } catch (err: any) {
    store.showError(err.message || 'Failed to edit author')
  }
}
</script>
<template>
  <div>
    <h1 class="title">Edit Author Id {{ authorId }}</h1>
    <div>
      <form @submit.prevent="editAuthor">
        <input
          v-model="name"
          class="input mb-4"
          type="name"
          placeholder="Author Name"
          :minlength="MIN_LENGTH"
          :maxlength="MAX_LENGTH"
          required
        />
        <input
          v-model="surname"
          class="input mb-4"
          type="surname"
          placeholder="Author Surname"
          :minlength="MIN_LENGTH"
          :maxlength="MAX_LENGTH"
          required
        />
        <button class="button" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>
