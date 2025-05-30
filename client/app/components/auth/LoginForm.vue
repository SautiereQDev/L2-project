<template>
  <UCard
    class="max-w-md mx-auto w-5/6"
    :ui="{
      root: 'overflow-hidden bg-white dark:bg-gray-800',
    }"
  >
    <template #header>
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">
        Se connecter
      </h2>
    </template>

    <form class="space-y-6 flex flex-col" @submit.prevent="onSubmit">
      <UAlert
        v-if="errorMessage"
        icon="i-heroicons-exclamation-triangle"
        color="error"
        variant="soft"
        title="Erreur d'authentification"
        :description="errorMessage"
        class="mb-6"
      />

      <MyFormGroup label="Email" name="email" required>
        <UInput
          v-model="state.email"
          type="email"
          :disabled="isLoading"
          placeholder="vous@exemple.com"
          icon="i-heroicons-envelope"
          size="lg"
          autocomplete="email"
          class="w-full"
        />
      </MyFormGroup>

      <MyFormGroup label="Mot de passe" name="password" required>
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
          :disabled="isLoading"
          autocomplete="current-password"
          class="w-full"
        />
      </MyFormGroup>

      <UButton
        type="submit"
        label="Se connecter"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
        :disabled="isLoading"
      />
    </form>
  </UCard>
</template>

<script setup lang="ts">
import { reactive, ref } from "#imports";
import { useRouter } from "#app";
import { z } from "zod";
import { useAuthStore } from "~/stores/auth.store";
import type { AuthCredentials } from "~/types/auth.types";
import MyFormGroup from "../ui/MyFormGroup.vue";

const props = defineProps<{
  redirectPath?: string;
}>();

const emit = defineEmits<{
  (e: "login-success"): void;
  (e: "login-error", error: string): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref("");

// Schéma de validation avec Zod
const validationSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

// State pour le formulaire
const state = reactive({
  email: "",
  password: "",
});

async function onSubmit() {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    // Valider manuellement les données avant de les envoyer
    const result = validationSchema.safeParse(state);

    if (!result.success) {
      // Afficher l'erreur de validation
      const firstError = result.error.errors[0];
      errorMessage.value =
        firstError?.message || "Données de formulaire invalides";
      isLoading.value = false;
      return;
    }

    // Créer l'objet credentials pour le service d'authentification
    const credentials: AuthCredentials = {
      email: state.email,
      password: state.password,
    };

    const success = await authStore.login(credentials);

    if (success) {
      emit("login-success");
      if (props.redirectPath) {
        router.push(props.redirectPath);
      }
    } else {
      errorMessage.value =
        authStore.authError ||
        "Échec de la connexion. Vérifiez vos identifiants.";
      emit("login-error", errorMessage.value);
    }
  } catch (error: unknown) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Une erreur est survenue lors de la connexion.";
    emit("login-error", errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}
</script>
