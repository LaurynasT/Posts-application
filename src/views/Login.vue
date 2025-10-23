<template>
  <div class="hero is-fullheight is-flex is-justify-content-center is-align-items-center">
    <div class="box">
      <h1 class="title has-text-centered">Login</h1>
      <form @submit.prevent="handleLogin">
        <input class="input mb-3" type="email" placeholder="Email" v-model="email" required />
        <input
          class="input mb-3"
          type="password"
          placeholder="Password"
          v-model="password"
          required
        />
        <div style="display: flex; justify-content: center">
          <button class="button is-align-items-center" type="submit">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { postData } from '../services/Api'
import type { User } from '@/Interfaces/users'
import { useNotificationStore } from '@/stores/notificationStore'
import { setToken } from '@/components/auth/authentication.ts'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const user = ref<User | null>(null)
const store = useNotificationStore()
const router = useRouter()
const error = ref<string | null>(null)

const handleLogin = async () => {
  try {
    const params = {
      email: email.value,
      password: password.value,
    }
    user.value = await postData<User>('/login', params)
    store.showSuccess('Login succesfull')
    setToken(user.value.accessToken)
    router.push('/posts')
  } catch (err: any) {
    if (!err.response) {
      error.value = err.message
      store.showError(error.value!)
    } else {
      store.showError(err.response.data)
    }
  }
}
</script>
