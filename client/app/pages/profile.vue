<template>
  <div class="profile-view">
    <h1>Mon Profil</h1>
    
    <div v-if="isLoading" class="loading">
      <p>Chargement du profil...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button class="retry-button" @click="fetchProfile">Réessayer</button>
    </div>
    
    <div v-else-if="profile" class="profile-card">
      <div class="profile-header">
        <div class="avatar">{{ profile.firstName?.[0] || profile.email[0] }}</div>
        <div class="user-info">
          <h2>{{ profile.firstName }} {{ profile.lastName }}</h2>
          <p class="email">{{ profile.email }}</p>
          <p class="roles">
            <span 
              v-for="role in profile.roles" 
              :key="role"
              class="role-badge"
            >
              {{ formatRole(role) }}
            </span>
          </p>
        </div>
      </div>
      
      <div class="account-info">
        <h3>Informations du compte</h3>
        <div class="info-row">
          <span class="label">Membre depuis</span>
          <span class="value">{{ formatDate(profile.createdAt) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Dernière mise à jour</span>
          <span class="value">{{ formatDate(profile.updatedAt) }}</span>
        </div>
      </div>
      
      <div class="actions">
        <button 
          class="logout-button" 
          @click="handleLogout"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import type { UserProfile } from '../types';

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

<style scoped>
.profile-view {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
  color: #1f2937;
  font-weight: 700;
}

.loading,
.error {
  padding: 2rem;
  text-align: center;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.error {
  background-color: #fee2e2;
  color: #b91c1c;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #b91c1c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.profile-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  padding: 2rem;
  background-color: #f3f4f6;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: #4f46e5;
  color: white;
  border-radius: 50%;
  font-size: 2rem;
  font-weight: bold;
  margin-right: 1.5rem;
}

.user-info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.email {
  margin: 0 0 0.5rem;
  color: #4b5563;
}

.roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  background-color: #e0e7ff;
  color: #4338ca;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.account-info {
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.account-info h3 {
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  color: #111827;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.label {
  color: #6b7280;
  font-weight: 500;
}

.value {
  color: #111827;
  font-weight: 600;
}

.actions {
  padding: 2rem;
  text-align: center;
}

.logout-button {
  padding: 0.75rem 2rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.logout-button:hover {
  background-color: #dc2626;
}
</style>
