import { ref, onMounted, onUnmounted } from 'vue'

const tokenKey = 'access_token'
const loggedIn = ref(!!localStorage.getItem(tokenKey))

function onStorage(event: StorageEvent) {
  if (event.key === tokenKey) {
    loggedIn.value = !!event.newValue
  }
}

export function setToken(token: string) {
  localStorage.setItem(tokenKey, token)
  loggedIn.value = true
}

export function getToken(): string | null {
  return localStorage.getItem(tokenKey)
}

export function removeToken() {
  localStorage.removeItem(tokenKey)
  loggedIn.value = false
}

export function refreshAuth() {
  loggedIn.value = !!getToken()
}

export function useAuthState() {
  onMounted(() => {
    window.addEventListener('storage', onStorage)
  })

  onUnmounted(() => {
    window.removeEventListener('storage', onStorage)
  })

  return loggedIn
}
