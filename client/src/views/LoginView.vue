<template>
  <div class="login-view">
    <h1>Connexion</h1>
    
    <LoginForm 
      redirect-path="/"
      @login-success="handleLoginSuccess"
      @login-error="handleLoginError"
    />
    
    <div class="auth-links">
      <router-link to="/forgot-password">Mot de passe oublié ?</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import LoginForm from '../components/LoginForm.vue';

const router = useRouter();
const authStore = useAuthStore();

// Vérifier si l'utilisateur est déjà connecté
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/');
  }
});

/**
 * Gestion de la connexion réussie
 */
function handleLoginSuccess() {
  console.log('Connexion réussie');
  // Vous pouvez ajouter des analytics ou d'autres actions ici
}

/**
 * Gestion des erreurs de connexion
 */
function handleLoginError(error: string) {
  console.error('Erreur de connexion:', error);
  // Vous pourriez envoyer ces erreurs à un service d'analytics ou de logging
}
</script>

<style scoped>
.login-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
}

h1 {
  margin-bottom: 2rem;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 700;
  text-align: center;
}

.auth-links {
  margin-top: 1.5rem;
  text-align: center;
}

.auth-links a {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.875rem;
}

.auth-links a:hover {
  text-decoration: underline;
}
</style>
