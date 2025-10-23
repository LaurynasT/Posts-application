<template>
  <div class="notification-container">
    <NotificationItem
      v-for="n in store.list"
      :key="n.id"
      :notification="n"
      :remove="store.remove"
      data-test="notification-item"
    />
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore'
import NotificationItem from './notificationItem.vue'

const store = useNotificationStore()
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100000;
  width: 300px;
}
</style>
