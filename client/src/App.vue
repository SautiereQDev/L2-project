<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, provide } from 'vue';
import { useAuthStore } from './stores/auth.store';
import Layout from "./Layout.vue";
import NotificationToaster from './components/ui/NotificationToaster.vue';
import Spinner from './components/ui/Spinner.vue';

// Stores
const authStore = useAuthStore();
const isLoading = ref(true);

// Récupération du thème système
const isDarkMode = ref(false);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

// Fonction pour gérer les changements de thème
const handleThemeChange = () => {
  // Vérifie d'abord les préférences stockées
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
  } else if (savedTheme === 'light') {
    isDarkMode.value = false;
  } else {
    // Sinon, utilise les préférences système
    isDarkMode.value = prefersDark.matches;
  }
  
  // Applique la classe au document
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Fonction pour basculer manuellement le thème
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
  handleThemeChange();
};

// Expose la fonction de changement de thème via provide/inject
provide('app', { toggleTheme });

// Vérifier l'état de l'authentification au chargement
onMounted(async () => {
  // Initialisation du thème
  handleThemeChange();
  
  // Ecoute les changements de préférence système
  prefersDark.addEventListener('change', handleThemeChange);
  
  // Vérifier si le token a besoin d'être rafraîchi
  if (authStore.token) {
    await authStore.refreshTokenIfNeeded();
  }
  isLoading.value = false;
});

// Nettoyer l'écouteur d'événements
onBeforeUnmount(() => {
  prefersDark.removeEventListener('change', handleThemeChange);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 antialiased">
    <!-- Loader pendant la vérification de l'authentification -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 z-50"
    >
      <Spinner class="text-primary-600 dark:text-primary-400" svgClass="h-10 w-10" />
      <p class="mt-4 text-gray-600 dark:text-gray-300">Chargement...</p>
    </div>
    
    <!-- Afficher le layout une fois l'authentification vérifiée -->
    <Layout v-else />
    
    <!-- Système de notifications -->
    <NotificationToaster />
  </div>
</template>

<style>
@import "tailwindcss";
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
