<template>
  <UCard 
    class="max-w-md mx-auto w-5/6" 
    :ui="{
      root: 'overflow-hidden bg-white dark:bg-gray-800'
    }"
  >
    <template #header>
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Créer un compte</h2>
    </template>

    <form class="space-y-6 flex flex-col" @submit.prevent="onSubmit">
      <UAlert
        v-if="errorMessage" 
        icon="i-heroicons-exclamation-triangle" 
        color="error" 
        variant="soft"
        title="Erreur d'inscription" 
        :description="errorMessage" 
        class="mb-6" 
      />

      <UAlert
        v-if="successMessage" 
        icon="i-heroicons-check-circle" 
        color="success" 
        variant="soft"
        title="Succès" 
        :description="successMessage" 
        class="mb-6" 
      />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormGroup label="Prénom" name="firstName">
          <UInput
            v-model="state.firstName" 
            type="text" 
            :disabled="isLoading" 
            placeholder="Jean"
            icon="i-heroicons-user" 
            size="lg" 
            autocomplete="given-name" 
            class="w-full" 
          />
        </UFormGroup>

        <UFormGroup label="Nom" name="lastName">
          <UInput
            v-model="state.lastName" 
            type="text" 
            :disabled="isLoading" 
            placeholder="Dupont"
            icon="i-heroicons-user" 
            size="lg" 
            autocomplete="family-name" 
            class="w-full" 
          />
        </UFormGroup>
      </div>

      <UFormGroup label="Email" name="email" required>
        <UInput
          v-model="state.email" 
          type="email" 
          :disabled="isLoading" 
          placeholder="jean.dupont@exemple.com"
          icon="i-heroicons-envelope" 
          size="lg" 
          autocomplete="email" 
          class="w-full" 
        />
      </UFormGroup>

      <UFormGroup label="Mot de passe" name="password" required>
        <UInput
          v-model="state.password" 
          type="password" 
          placeholder="••••••••" 
          icon="i-heroicons-lock-closed" 
          size="lg"
          :disabled="isLoading" 
          autocomplete="new-password" 
          class="w-full" 
        />
      </UFormGroup>

      <UFormGroup label="Confirmer le mot de passe" name="passwordConfirm" required>
        <UInput
          v-model="state.passwordConfirm" 
          type="password" 
          placeholder="••••••••" 
          icon="i-heroicons-lock-closed" 
          size="lg"
          :disabled="isLoading" 
          autocomplete="new-password" 
          class="w-full" 
        />
      </UFormGroup>

      <UButton
        type="submit" 
        label="Créer mon compte" 
        color="primary" 
        size="lg" 
        block 
        :loading="isLoading"
        :disabled="isLoading" 
      />
    </form>

    <template #footer>
      <div class="text-center">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Déjà un compte ? 
          <NuxtLink to="/login" class="text-primary-600 hover:text-primary-500 font-medium">
            Se connecter
          </NuxtLink>
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import { useAuthStore } from '../stores/auth.store';
import type { UserRegistrationData } from '../types/auth.types';

const props = defineProps<{
  redirectPath?: string;
}>();

const emit = defineEmits<{
  (e: 'registration-success'): void;
  (e: 'registration-error', error: string): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

// Schéma de validation avec Zod
const validationSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  passwordConfirm: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

// State pour le formulaire
const state = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  firstName: '',
  lastName: ''
});

async function onSubmit() {
  errorMessage.value = '';
  successMessage.value = '';
  isLoading.value = true;

  try {
    // Valider manuellement les données avant de les envoyer
    const result = validationSchema.safeParse(state);
    
    if (!result.success) {
      // Afficher l'erreur de validation
      const firstError = result.error.errors[0];
      errorMessage.value = firstError?.message || 'Données de formulaire invalides';
      return;
    }
    
    // Créer l'objet de données d'inscription
    const registrationData: UserRegistrationData = {
      email: state.email,
      password: state.password,
      firstName: state.firstName || undefined,
      lastName: state.lastName || undefined
    };
    
    const success = await authStore.register(registrationData);

    if (success) {
      successMessage.value = 'Compte créé avec succès ! Vous êtes maintenant connecté.';
      emit('registration-success');
      
      // Rediriger après un court délai pour permettre à l'utilisateur de voir le message de succès
      setTimeout(() => {
        if (props.redirectPath) {
          router.push(props.redirectPath);
        } else {
          router.push('/');
        }
      }, 1500);
    } else {
      errorMessage.value = authStore.authError || 'Échec de l\'inscription. Veuillez réessayer.';
      emit('registration-error', errorMessage.value);
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription.';
    errorMessage.value = errorMsg;
    emit('registration-error', errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}
</script>
