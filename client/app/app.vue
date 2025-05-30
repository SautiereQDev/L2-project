<template>
  <UApp>
    <NuxtLayout>
      <div
        v-if="isQueryClientAvailable"
        class="p-4 bg-green-100 text-green-800 fixed top-0 right-0 z-50"
      >
        Vue Query OK
      </div>
      <div v-else class="p-4 bg-red-100 text-red-800 fixed top-0 right-0 z-50">
        Vue Query Error
      </div>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup>
// Test Vue Query Client
const nuxtApp = useNuxtApp();
const isQueryClientAvailable = computed(() => !!nuxtApp.$queryClient);
</script>
