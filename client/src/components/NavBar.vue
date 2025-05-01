<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import AuthMenu from './AuthMenu.vue';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  TrophyIcon,
  UserIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline';

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
  <nav class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span @click="navigateTo('/')" class="flex items-center gap-2 text-xl font-bold text-primary-600 dark:text-primary-400 cursor-pointer hover:opacity-80 transition-opacity">
              <TrophyIcon class="h-6 w-6" />
              Records Viewer
            </span>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-4">
            <a @click="navigateTo('/')" 
              class="border-transparent text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-all"
              :class="{ 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300': $route.path === '/' }">
              <HomeIcon class="h-5 w-5 mr-1" />
              Accueil
            </a>
            <a @click="navigateTo('/records')"
              class="border-transparent text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-all"
              :class="{ 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300': $route.path === '/records' }">
              <ChartBarIcon class="h-5 w-5 mr-1" />
              Records
            </a>
            <a @click="navigateTo('/athletes')"
              class="border-transparent text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-all"
              :class="{ 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300': $route.path === '/athletes' }">
              <UserGroupIcon class="h-5 w-5 mr-1" />
              Athlètes
            </a>
            <a @click="navigateTo('/about')"
              class="border-transparent text-gray-600 dark:text-gray-300 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-all"
              :class="{ 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300': $route.path === '/about' }">
              <InformationCircleIcon class="h-5 w-5 mr-1" />
              À propos
            </a>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <!-- Éléments de droite (recherche + authentification) -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <AuthMenu />
            </div>
          </div>
        </div>
        
        <div class="-mr-2 flex items-center sm:hidden">
          <button 
            @click="toggleMenu" 
            type="button" 
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors" 
            aria-controls="mobile-menu" 
            :aria-expanded="isOpen"
          >
            <span class="sr-only">Ouvrir le menu</span>
            <Bars3Icon v-if="!isOpen" class="h-6 w-6" />
            <XMarkIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Menu mobile avec transition -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-show="isOpen" class="sm:hidden absolute w-full bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-20" id="mobile-menu">
        <div class="pt-2 pb-3 space-y-1">
          <a @click="navigateTo('/')" 
            class="flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 border-l-4 border-transparent text-base font-medium cursor-pointer transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300': $route.path === '/' }">
            <HomeIcon class="h-5 w-5 mr-3" />
            Accueil
          </a>
          
          <a @click="navigateTo('/records')"
            class="flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 border-l-4 border-transparent text-base font-medium cursor-pointer transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300': $route.path === '/records' }">
            <ChartBarIcon class="h-5 w-5 mr-3" />
            Records
          </a>
          
          <a @click="navigateTo('/athletes')"
            class="flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 border-l-4 border-transparent text-base font-medium cursor-pointer transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300': $route.path === '/athletes' }">
            <UserGroupIcon class="h-5 w-5 mr-3" />
            Athlètes
          </a>
          
          <a @click="navigateTo('/about')"
            class="flex items-center text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 px-4 py-3 border-l-4 border-transparent text-base font-medium cursor-pointer transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 dark:border-primary-400 text-primary-700 dark:text-primary-300': $route.path === '/about' }">
            <InformationCircleIcon class="h-5 w-5 mr-3" />
            À propos
          </a>
          
          <!-- Barre de recherche mobile -->
          <div class="px-4 py-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
              </div>
              <input 
                type="search" 
                placeholder="Rechercher..."
                class="w-full h-10 pl-9 pr-3 rounded-md text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400" 
              />
            </div>
          </div>
        </div>
        
        <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div class="px-4">
            <div class="flex-grow">
              <!-- Version mobile du menu d'authentification -->
              <div v-if="authStore.isAuthenticated" class="space-y-2">
                <a @click="navigateTo('/profile')" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2 text-base font-medium cursor-pointer">
                  <UserIcon class="h-5 w-5 mr-3" />
                  Mon profil
                </a>
                <button @click="authStore.logout(); router.push('/login')" class="flex items-center w-full text-left text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 py-2 text-base font-medium cursor-pointer border-none bg-transparent">
                  <ArrowRightOnRectangleIcon class="h-5 w-5 mr-3" />
                  Se déconnecter
                </button>
              </div>
              <div v-else class="space-y-3 py-2">
                <a @click="navigateTo('/login')" class="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 py-2 text-base font-medium cursor-pointer">
                  <ArrowLeftOnRectangleIcon class="h-5 w-5 mr-3" />
                  Se connecter
                </a>
                <a @click="navigateTo('/register')" class="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white py-2 px-4 rounded-md text-base font-medium cursor-pointer transition-colors">
                  <UserPlusIcon class="h-5 w-5 mr-2" />
                  S'inscrire
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>