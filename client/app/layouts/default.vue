<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav-bar />
    </header>
    
    <main class="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <transition name="page" mode="out-in">
        <NuxtPage class="main-content" />
      </transition>
    </main>
    
    <footer class="py-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {{ currentYear }} RecordsViewer (Quentin Sautière) - Tous droits réservés</p>
          <div class="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Conditions d'utilisation
            </a>
            <a href="#" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Confidentialité
            </a>
            <button 
              class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" 
              aria-label="Toggle theme"
              @click="toggleTheme"
            >
              <SunIcon v-if="isDarkMode" class="h-5 w-5" />
              <MoonIcon v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { inject, ref, onMounted } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const currentYear = new Date().getFullYear();
// Détecter le mode sombre uniquement côté client
const isDarkMode = ref(false);
onMounted(() => {
  isDarkMode.value = document?.documentElement?.classList.contains('dark');
});

// Accéder à la méthode toggleTheme exposée par App.vue
const toggleTheme = () => {
  const app = inject('app');
  if (app && app.toggleTheme) {
    app.toggleTheme();
    isDarkMode.value = !isDarkMode.value;
  }
};
</script>

<style>
/* Animations des pages */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.app-footer {
  background-color: var(--primary-color);
  color: white;
  padding: 1.5rem 0;
  margin-top: 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .app-footer {
    padding: 1rem 0;
  }
}
</style>