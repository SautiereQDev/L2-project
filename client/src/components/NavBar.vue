<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import AuthMenu from './AuthMenu.vue';

const router = useRouter();
const authStore = useAuthStore();
const isOpen = ref(false);

const navigateTo = (route: string) => {
  router.push(route);
  isOpen.value = false;
};

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};
</script>

<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span @click="navigateTo('/')" class="text-xl font-bold text-blue-700 cursor-pointer">Records Viewer</span>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a @click="navigateTo('/')" 
              class="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              :class="{ 'border-blue-500 text-blue-700': $route.path === '/' }">
              Accueil
            </a>
            <a @click="navigateTo('/records')"
              class="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              :class="{ 'border-blue-500 text-blue-700': $route.path === '/records' }">
              Records
            </a>
            <a @click="navigateTo('/athletes')"
              class="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              :class="{ 'border-blue-500 text-blue-700': $route.path === '/athletes' }">
              Athlètes
            </a>
            <a @click="navigateTo('/about')"
              class="border-transparent text-gray-500 hover:border-blue-500 hover:text-blue-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
              :class="{ 'border-blue-500 text-blue-700': $route.path === '/about' }">
              À propos
            </a>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Remplacer les boutons de connexion par le composant AuthMenu -->
          <AuthMenu />
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <button @click="toggleMenu" type="button" class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500" aria-controls="mobile-menu" :aria-expanded="isOpen">
            <span class="sr-only">Ouvrir le menu</span>
            <svg :class="{'hidden': isOpen, 'block': !isOpen}" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg :class="{'block': isOpen, 'hidden': !isOpen}" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Menu mobile -->
    <div :class="{'block': isOpen, 'hidden': !isOpen}" class="sm:hidden" id="mobile-menu">
      <div class="pt-2 pb-3 space-y-1">
        <a @click="navigateTo('/')" 
          class="text-gray-600 hover:bg-blue-50 hover:text-blue-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium cursor-pointer"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-700': $route.path === '/' }">
          Accueil
        </a>
        <a @click="navigateTo('/records')"
          class="text-gray-600 hover:bg-blue-50 hover:text-blue-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium cursor-pointer"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-700': $route.path === '/records' }">
          Records
        </a>
        <a @click="navigateTo('/athletes')"
          class="text-gray-600 hover:bg-blue-50 hover:text-blue-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium cursor-pointer"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-700': $route.path === '/athletes' }">
          Athlètes
        </a>
        <a @click="navigateTo('/about')"
          class="text-gray-600 hover:bg-blue-50 hover:text-blue-700 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium cursor-pointer"
          :class="{ 'bg-blue-50 border-blue-500 text-blue-700': $route.path === '/about' }">
          À propos
        </a>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        <div class="flex items-center px-4">
          <div class="flex-grow">
            <!-- Version mobile du menu d'authentification -->
            <div v-if="authStore.isAuthenticated" class="flex flex-col">
              <a @click="navigateTo('/profile')" class="text-gray-500 hover:text-blue-700 block px-3 py-2 text-base font-medium cursor-pointer">Mon profil</a>
              <button @click="authStore.logout(); router.push('/login')" class="text-left text-red-500 hover:text-red-700 block px-3 py-2 text-base font-medium cursor-pointer border-none bg-transparent">Se déconnecter</button>
            </div>
            <div v-else class="flex flex-col">
              <a @click="navigateTo('/login')" class="text-gray-500 hover:text-blue-700 block px-3 py-2 text-base font-medium cursor-pointer">Se connecter</a>
              <a @click="navigateTo('/register')" class="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-1 text-center cursor-pointer">S'inscrire</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Ajoutez vos styles supplémentaires ici si nécessaire */
</style>