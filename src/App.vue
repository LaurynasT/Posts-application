<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/navigation/navbar.vue'
import Notifications from './components/notifications/notifications.vue'
import Modal from './components/modal/modal.vue'
import { ref, shallowRef } from 'vue'

const isModalVisible = ref(false)
const modalComponent = shallowRef()
const modalProps = ref({})

function openModal(component: any, props = {}) {
  modalComponent.value = component
  modalProps.value = props
  isModalVisible.value = true
}

function closeModal() {
  isModalVisible.value = false
}
import { refreshAuth } from '@/components/auth/authentication'

refreshAuth()
</script>

<template>
  <NavBar />
  <Notifications />
  <Modal
    v-if="isModalVisible"
    :component="modalComponent"
    :props="modalProps"
    @close="closeModal"
  />
  <RouterView :open-modal="openModal" :close="closeModal" />
</template>
