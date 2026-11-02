<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg class="px" aria-hidden="true">
    <use :href="`#i-${name}`" />
  </svg>
</template>
