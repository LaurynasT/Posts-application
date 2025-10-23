<script setup lang="ts">
import { ref } from 'vue'
import { postData } from '@/services/Api'
import { useNotificationStore } from '@/stores/notificationStore'
import { jwtDecode } from 'jwt-decode'
import type { JwtPayload } from '@/Interfaces/jwtPayload'
import type { Authors } from '@/Interfaces/authors'
import { getToken } from '@/components/auth/authentication'

const name = ref('')
const surname = ref('')
const loading = ref(false)
const store = useNotificationStore()
const emit = defineEmits(['created', 'close'])
const MIN_LENGTH = 2
const MAX_LENGTH = 20

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

async function submitForm() {
  loading.value = true
  try {
    const Name = name.value.trim()
    const Surname = surname.value.trim()

    if (Name.length < MIN_LENGTH || Surname.length < MIN_LENGTH) {
      throw new Error(`Name and surname must be at least ${MIN_LENGTH} characters`)
    }
    if (Name.length > MAX_LENGTH || Surname.length > MAX_LENGTH) {
      throw new Error(`Name and surname cannot exceed ${MAX_LENGTH} characters`)
    }

    const userId = getUserIdFromJWT()
    if (!userId) throw new Error('User ID not found in token')

    await postData<Authors>('/authors', {
      name: Name,
      surname: Surname,
      userId,
      created_at: new Date().toISOString().split('.')[0] + 'Z',
      updated_at: new Date().toISOString().split('.')[0] + 'Z',
    })
    store.showSuccess('Author created successfully')
    emit('created')
    emit('close')
  } catch (err: any) {
    store.showError(err.message || 'Failed to create author')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="title">Create Author</h1>
    <form @submit.prevent="submitForm">
      <input
        v-model="name"
        class="input mb-4"
        type="text"
        placeholder="Author Name"
        :minlength="MIN_LENGTH"
        :maxlength="MAX_LENGTH"
        required
      />
      <input
        v-model="surname"
        class="input mb-4"
        type="text"
        placeholder="Author Surname"
        :minlength="MIN_LENGTH"
        :maxlength="MAX_LENGTH"
        required
      />
      <button class="button" type="submit">Submit</button>
    </form>
  </div>
</template>
