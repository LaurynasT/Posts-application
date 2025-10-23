<template>
  <div class="container is-max-tablet">
    <div class="control container is-fullhd">
      <input v-model="search" @input="onInput" class="input" type="text" placeholder="Search" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['update:search'])
const search = ref('')
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

function onInput() {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  debounceTimeout = setTimeout(() => {
    emit('update:search', search.value)
  }, 500)
}
</script>
