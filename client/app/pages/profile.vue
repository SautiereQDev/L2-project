<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-8">Mon Profil</h1>

    <div v-if="isLoading" class="p-8 text-center bg-gray-50 rounded-lg shadow-sm">
      <p class="text-gray-600">Chargement du profil...</p>
    </div>

    <div v-else-if="error" class="p-8 text-center bg-red-50 rounded-lg shadow-sm">
      <p class="text-red-700">{{ error }}</p>
      <button
          class="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800 transition-colors"
          @click="fetchProfile"
      >
        Réessayer
      </button>
    </div>

    <div v-else-if="profile" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="flex items-center p-8 bg-gray-100">
        <div
            class="flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-full text-xl font-semibold">
          {{ profile.firstName?.[0] || profile.email[0] }}
        </div>
        <div class="ml-6">
          <h2 class="text-xl font-semibold text-gray-800">{{ profile.firstName }} {{ profile.lastName }}</h2>
          <p class="text-gray-500">{{ profile.email }}</p>
          <p class="mt-2 flex flex-wrap gap-2">
            <span
                v-for="role in profile.roles"
                :key="role"
                class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
            >
              {{ formatRole(role) }}
            </span>
          </p>
        </div>
      </div>

      <div class="p-6 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-800 mb-4">Informations du compte</h3>
        <div class="grid grid-cols-2 gap-4">
          <span class="text-gray-500">Membre depuis</span>
          <span class="text-gray-800 font-medium">{{ formatDate(profile.createdAt) }}</span>

          <span class="text-gray-500">Dernière mise à jour</span>
          <span class="text-gray-800 font-medium">{{ formatDate(profile.updatedAt) }}</span>
        </div>
      </div>

      <div class="p-6 border-t border-gray-200 flex justify-end">
        <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            @click="handleLogout"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router';
import {useAuthStore} from '../stores/auth.store';
import type {UserProfile} from '../types';

const router = useRouter();
const authStore = useAuthStore();

const profile = ref<UserProfile | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  // Vérifier l'authentification
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }

  await fetchProfile();
});

/**
 * Récupère les données du profil utilisateur
 */
async function fetchProfile() {
  isLoading.value = true;
  error.value = null;

  try {
    // Vérifier si le token a besoin d'être rafraîchi
    await authStore.refreshTokenIfNeeded();

    if (!authStore.isAuthenticated) {
      router.push('/login');
      return;
    }

    // Récupérer le profil depuis le store
    await authStore.fetchUserProfile();
    profile.value = authStore.userProfile;

    if (!profile.value) {
      error.value = "Impossible de récupérer les données du profil";
    }
  } catch (err: any) {
    error.value = err.message || "Une erreur est survenue lors du chargement du profil";
    console.error("Erreur de chargement du profil:", err);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Formate un rôle pour l'affichage
 */
function formatRole(role: string): string {
  return role.replace('ROLE_', '').toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

/**
 * Formate une date pour l'affichage
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

/**
 * Gère la déconnexion
 */
function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

