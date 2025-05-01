<template>
  <div class="auth-menu">
    <template v-if="authStore.isAuthenticated">
      <div class="auth-dropdown" @click.stop="toggleDropdown" ref="dropdownRef">
        <div class="user-avatar">
          {{ userInitial }}
        </div>
        
        <div v-show="dropdownOpen" class="dropdown-menu">
          <router-link to="/profile" class="dropdown-item">
            <i class="icon-user"></i>
            Mon profil
          </router-link>
          
          <button @click="handleLogout" class="dropdown-item logout">
            <i class="icon-logout"></i>
            Se déconnecter
          </button>
        </div>
      </div>
    </template>
    
    <template v-else>
      <router-link to="/login" class="login-button">
        Connexion
      </router-link>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

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
  return 'U'; // User par défaut
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
  router.push('/login');
}

// Ajouter/retirer l'écouteur de clic pour fermer le dropdown
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.auth-menu {
  position: relative;
}

.login-button {
  display: inline-block;
  padding: 0.5rem 1rem;
  color: #4f46e5;
  background-color: transparent;
  border: 1px solid #4f46e5;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.login-button:hover {
  background-color: #4f46e5;
  color: white;
}

.auth-dropdown {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  margin-top: 0.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  z-index: 10;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 0.9rem;
}

.dropdown-item i {
  margin-right: 0.5rem;
  font-size: 1rem;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #4f46e5;
}

.dropdown-item.logout {
  color: #ef4444;
  cursor: pointer;
}

.dropdown-item.logout:hover {
  background-color: #fee2e2;
}

/* Icons (placeholders) */
.icon-user::before {
  content: "👤";
}

.icon-logout::before {
  content: "🚪";
}
</style>
