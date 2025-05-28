<template>
  <div class="page-header mb-8">
    <div class="flex items-center mb-2">
      <slot name="icon"/>
      <h1 :class="titleClass">{{ title }}</h1>
    </div>
    <p v-if="description" class="text-gray-600 dark:text-gray-300">{{ description }}</p>
    <slot/>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  titleClass: {
    type: String,
    default: 'font-bold text-2xl mb-2 ml-2 text-primary-600 dark:text-primary-400'
  }
});
</script>
