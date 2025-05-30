<template>
  <div class="max-w-md mx-auto w-full px-4 py-8 flex flex-col items-center">
    <h1
      class="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center"
    >
      Connexion
    </h1>

    <LoginForm
      redirect-path="/"
      @login-success="handleLoginSuccess"
      @login-error="handleLoginError"
    />

    <div class="mt-6 text-center">
      <NuxtLink
        to="/forgot-password"
        class="text-sm text-indigo-600 hover:underline"
        >Mot de passe oublié ?</NuxtLink
      >
      <span class="mx-2 text-gray-500"> | </span>
      <NuxtLink to="/register" class="text-sm text-indigo-600 hover:underline"
        >Créer un compte</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, useRouter } from "#imports";
import { useAuthStore } from "~/stores/auth.store";
import LoginForm from "~/components/auth/LoginForm.vue";

const router = useRouter();
const authStore = useAuthStore();

// Vérifier si l'utilisateur est déjà connecté
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push("/");
  }
});

/**
 * Gestion de la connexion réussie
 */
function handleLoginSuccess() {
  console.log("Connexion réussie");
}

/**
 * Gestion des erreurs de connexion
 */
function handleLoginError(error: string) {
  console.error("Erreur de connexion:", error);
}
</script>
