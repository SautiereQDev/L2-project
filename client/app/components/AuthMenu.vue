<template>
  <div class="relative">
    <template v-if="authStore.isAuthenticated">
      <!-- Avatar de l'utilisateur connecté -->
      <button
        ref="dropdownRef"
        class="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
        @click.stop="toggleDropdown"
      >
        <span
          class="h-10 w-10 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-sm font-medium"
        >
          {{ userInitial }}
        </span>
        <span
          class="hidden md:flex items-center text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          <span>{{ userName }}</span>
          <ChevronDownIcon
            class="ml-1 h-5 w-5 text-gray-400"
            :class="{ 'rotate-180 transform': dropdownOpen }"
          />
        </span>
      </button>

      <!-- Menu déroulant utilisateur -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-show="dropdownOpen"
          class="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700"
        >
          <!-- Informations utilisateur -->
          <div class="px-4 py-3">
            <p class="text-sm text-gray-700 dark:text-gray-200">
              Connecté en tant que
            </p>
            <p
              class="truncate text-sm font-medium text-gray-900 dark:text-white"
            >
              {{ authStore.userProfile?.email }}
            </p>
          </div>

          <!-- Actions utilisateur -->
          <div class="py-1">
            <router-link
              to="/profile"
              class="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <UserIcon
                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
              />
              Mon profil
            </router-link>
            <router-link
              to="/settings"
              class="group flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Cog6ToothIcon
                class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300"
              />
              Paramètres
            </router-link>
          </div>

          <!-- Déconnexion -->
          <div class="py-1">
            <button
              class="group flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              @click="handleLogout"
            >
              <ArrowRightOnRectangleIcon
                class="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600"
              />
              Se déconnecter
            </button>
          </div>
        </div>
      </Transition>
    </template>

    <!-- Boutons pour les utilisateurs non connectés -->
    <template v-else>
      <div class="flex items-center gap-3">
        <router-link
          to="/login"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm px-2 py-1 transition-colors"
        >
          Connexion
        </router-link>
        <router-link
          to="/register"
          class="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
        >
          <UserPlusIcon class="h-4 w-4 mr-1" />
          S'inscrire
        </router-link>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import {
  ChevronDownIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter();
const authStore = useAuthStore();
const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Calculer l'initiale de l'utilisateur pour l'avatar
const userInitial = computed(() => {
  if (authStore.userProfile?.firstName) {
    return authStore.userProfile.firstName[0].toUpperCase();
  } else if (authStore.userProfile?.email) {
    return authStore.userProfile.email[0].toUpperCase();
  }
  return "U"; // User par défaut
});

// Nom à afficher
const userName = computed(() => {
  if (authStore.userProfile?.firstName && authStore.userProfile?.lastName) {
    return `${authStore.userProfile.firstName} ${authStore.userProfile.lastName}`;
  } else if (authStore.userProfile?.firstName) {
    return authStore.userProfile.firstName;
  } else if (authStore.userProfile?.email) {
    return authStore.userProfile.email.split("@")[0];
  }
  return "Utilisateur";
});

// Fermer le dropdown quand on clique en dehors
function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
}

// Ouvrir/fermer le dropdown
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Déconnexion
function handleLogout() {
  dropdownOpen.value = false;
  authStore.logout();
  router.push("/login");
}

// Ajouter/retirer l'écouteur de clic pour fermer le dropdown
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
