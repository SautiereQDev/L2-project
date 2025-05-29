<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <header
      class="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
    >
      <nav-bar />
    </header>

    <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <NuxtPage class="py-8" />
    </main>

    <footer
      class="py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
    >
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          &copy; {{ currentYear }} RecordsViewer (Quentin Sautière) - Tous
          droits réservés
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { ref } from "vue";
import { SunIcon, MoonIcon } from "@heroicons/vue/24/outline";

const isDarkMode = ref(false);

const toggleTheme = () => {
  console.error("Toggle theme not implemented yet");
};

const currentYear = new Date().getFullYear();
</script>
