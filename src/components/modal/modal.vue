<template>
  <teleport to="body">
    <div class="modal is-active">
      <div class="modal-background" @click="$emit('close')"></div>
      <div class="modal-content">
        <component :is="component" v-bind="props" @close="$emit('close')" />
      </div>
      <button
        data-test="close"
        class="modal-close is-large"
        aria-label="close"
        @click="$emit('close')"
      ></button>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineProps({
  component: Object,
  props: Object,
})
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 10000;
}
</style>
