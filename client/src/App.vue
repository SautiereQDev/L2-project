<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';
import Layout from "./Layout.vue";

const authStore = useAuthStore();
const isLoading = ref(true);

// Vérifier l'état de l'authentification au chargement
onMounted(async () => {
  // Vérifier si le token a besoin d'être rafraîchi
  if (authStore.token) {
    await authStore.refreshTokenIfNeeded();
  }
  isLoading.value = false;
});
</script>

<template>
  <div>
    <!-- Afficher un loader pendant la vérification de l'authentification -->
    <div v-if="isLoading" class="auth-loading">
      <div class="loader"></div>
      <p>Chargement...</p>
    </div>
    
    <!-- Afficher le layout une fois l'authentification vérifiée -->
    <Layout v-else />
  </div>
</template>

<style>
@import "tailwindcss";

.auth-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
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
