<template>
  <div
    :class="['notification', notification.type === 'error' ? 'is-danger' : 'is-success']"
    @click="remove(notification.id)"
  >
    <button class="delete" @click.stop="remove(notification.id)"></button>
    {{ notification.message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  notification: { id: string; message: string; type: 'error' | 'success' }
  remove: (id: string) => void
}>()
</script>

<style scoped>
.notification {
  margin-bottom: 0.75rem;
  cursor: pointer;
}
</style>
