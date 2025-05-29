<template>
  <div class="register-view">
    <h1>Inscription</h1>

    <RegistrationForm
      redirect-path="/"
      @registration-success="handleRegistrationSuccess"
      @registration-error="handleRegistrationError"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import RegistrationForm from "../components/RegistrationForm.vue";

const router = useRouter();
const authStore = useAuthStore();

// Vérifier si l'utilisateur est déjà connecté
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push("/");
  }
});

/**
 * Gestion de l'inscription réussie
 */
function handleRegistrationSuccess() {
  console.log("Inscription réussie");
}

/**
 * Gestion des erreurs d'inscription
 */
function handleRegistrationError(error: string) {
  console.error("Erreur d'inscription:", error);
}
</script>

<style scoped>
.register-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
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
</style>
