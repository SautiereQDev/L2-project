<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <header
        class="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav-bar/>
    </header>

    <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2.5"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2.5"
          mode="out-in"
      >
        <NuxtPage class="py-8"/>
      </transition>
    </main>

    <footer class="py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {{ currentYear }} RecordsViewer (Quentin Sautière) - Tous droits réservés</p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <NuxtLink to="/terms" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Conditions d'utilisation
            </NuxtLink>
            <NuxtLink to="/privacy" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Confidentialité
            </NuxtLink>
            <button
                class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
                @click="toggleTheme"
            >
              <SunIcon v-if="isDarkMode" class="h-5 w-5"/>
              <MoonIcon v-else class="h-5 w-5"/>
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import {ref} from 'vue';
import {SunIcon, MoonIcon} from '@heroicons/vue/24/outline';

const isDarkMode = ref(false);

const toggleTheme = () => {
  console.error('Toggle theme not implemented yet');
};

const currentYear = new Date().getFullYear();
</script>