<script setup lang="ts">
import { useRouter } from 'vue-router'
import { removeToken, useAuthState } from '@/components/auth/authentication'

const loggedIn = useAuthState()
const router = useRouter()

function handleLogout() {
  removeToken()
  router.push('/login')
}
</script>

<template>
  <nav class="navbar is-dark">
    <div class="navbar-start">
      <RouterLink to="/posts" class="navbar-item">Posts</RouterLink>
      <RouterLink to="/authors" class="navbar-item">Authors</RouterLink>
    </div>
    <div class="navbar-end">
      <div v-if="!loggedIn">
        <RouterLink to="/login" class="navbar-item">Login</RouterLink>
      </div>
      <div v-else>
        <a data-test="logout" class="navbar-item" @click.prevent="handleLogout">Logout</a>
      </div>
    </div>
  </nav>
</template>
