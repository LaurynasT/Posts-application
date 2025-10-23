import { defineStore } from 'pinia'
import { ref, readonly } from 'vue'

type Notification = {
  id: string
  message: string
  type: 'error' | 'success'
}

export const useNotificationStore = defineStore('notification', () => {
  const queue = ref<Notification[]>([])
  const list = ref<Notification[]>([])
  const timeout = ref<ReturnType<typeof setTimeout> | null>(null)


  function enqueue(message: string, type: 'error' | 'success') {
    const id = Date.now().toString()
    const notification: Notification = { id, message, type }
    queue.value.push(notification)
    processQueue()
  }

  function showError(message: string) {
    enqueue(message, 'error')
  }

  function showSuccess(message: string) {
    enqueue(message, 'success')
  }

  function remove(id: string) {
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }

    list.value = list.value.filter((n) => n.id !== id)

    nextTimer()
  }

  function nextTimer() {
    if (list.value.length === 0) return

    const next = list.value[0]

    timeout.value = setTimeout(() => {
      remove(next.id)
    }, 3000)
  }

  function processQueue() {
    while (queue.value.length > 0) {
      const next = queue.value.shift()!
      list.value.push(next)
    }

    if (!timeout.value && list.value.length > 0) {
      nextTimer()
    }
  }

  function clear() {
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }

    queue.value = []
    list.value = []
  }

  return {
    list: readonly(list),
    clear,
    showError,
    showSuccess,
    remove,
  }
})
