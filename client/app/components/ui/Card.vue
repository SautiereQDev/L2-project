<template>
  <div 
    class="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 shadow-sm"
    :class="className"
  >
    <!-- En-tête de la carte (optionnel) -->
    <div 
      v-if="$slots.header || title" 
      class="px-6 py-4 flex flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700"
    >
      <div v-if="title" class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ title }}
      </div>
      <slot name="header"/>
    </div>
    
    <!-- Corps principal de la carte -->
    <div 
      class="px-6 py-4"
      :class="{
        'pt-6': !$slots.header && !title
      }"
    >
      <slot/>
    </div>
    
    <!-- Pied de la carte (optionnel) -->
    <div 
      v-if="$slots.footer" 
      class="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg"
    >
      <slot name="footer"/>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  className?: string;
}

withDefaults(defineProps<Props>(), {
  title: undefined,
  className: '',
});
</script>
