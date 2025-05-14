<template>
  <UCard class="max-w-md mx-auto w-5/6" :ui="{
    root: 'overflow-hidden bg-white dark:bg-gray-800'
  }">
    <template #header>
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Se connecter</h2>
    </template>

    <UForm :schema="loginSchema" :state="state" class="space-y-6 flex flex-col" @submit="handleSubmit">
      <UAlert v-if="errorMessage" icon="i-heroicons-exclamation-triangle" color="error" variant="soft"
        title="Erreur de connexion" :description="errorMessage" class="mb-6" />

      <UFormGroup label="Email" name="email" required>
        <UInput v-model="state.email" type="email" :disabled="isLoading" placeholder="vous@exemple.com"
          icon="i-heroicons-envelope" size="lg" autocomplete="email" class="w-full" />
      </UFormGroup>

      <UFormGroup label="Mot de passe" name="password" required>
        <UInput v-model="state.password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed" size="lg"
          :disabled="isLoading" autocomplete="current-password" class="w-full" />
      </UFormGroup>

      <UButton type="submit" label="Se connecter" color="primary" size="lg" block :loading="isLoading"
        :disabled="isLoading" />
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';
import { useAuthStore } from '../stores/auth.store';

const props = defineProps<{
  redirectPath?: string;
}>();

const emit = defineEmits<{
  (e: 'login-success'): void;
  (e: 'login-error', error: string): void;
}>();

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);
const errorMessage = ref('');

const loginSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type LoginSchema = z.output<typeof loginSchema>;

const state = reactive<LoginSchema>({
  email: '',
  password: ''
});

async function handleSubmit(event: FormSubmitEvent<LoginSchema>) {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    // Validation is handled by UForm, event.data contains validated data
    const success = await authStore.login(event.data);

    if (success) {
      emit('login-success');
      if (props.redirectPath) {
        router.push(props.redirectPath);
      }
    } else {
      errorMessage.value = authStore.authError || 'Échec de la connexion. Vérifiez vos identifiants.';
      emit('login-error', errorMessage.value);
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Une erreur est survenue lors de la connexion.';
    emit('login-error', errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}</script>