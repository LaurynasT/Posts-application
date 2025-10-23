<script lang="ts" setup>
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits(['update:page'])

function nextPage() {
  if (props.page < props.totalPages) {
    emit('update:page', props.page + 1)
  }
}

function prevPage() {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
  }
}
</script>

<template>
  <div class="is-flex is-justify-content-center is-align-items-center mt-4">
    <button @click="prevPage" class="button mr-4" :disabled="page === 1">Prev</button>
    <span class="has-text-weight-bold is-size-5">{{ page }} / {{ totalPages }}</span>
    <button @click="nextPage" class="button ml-4" :disabled="page === totalPages">Next</button>
  </div>
</template>

<style scoped></style>
