<template>
  <div class="auth-form">
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          v-model="credentials.email" 
          type="email" 
          required 
          autocomplete="email"
          :disabled="isLoading"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <div class="password-input">
          <input 
            id="password" 
            v-model="credentials.password" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            autocomplete="password"
            :disabled="isLoading"
          />
          <button 
            type="button" 
            class="toggle-password" 
            @click="togglePasswordVisibility"
            :disabled="isLoading"
          >
            {{ showPassword ? 'Cacher' : 'Afficher' }}
          </button>
        </div>
      </div>
      
      <div class="form-actions">
        <button 
          type="submit" 
          class="submit-button" 
          :disabled="isLoading"
        >
          <span v-if="isLoading">Connexion en cours...</span>
          <span v-else>Se connecter</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import type { AuthCredentials } from '../types';

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
const showPassword = ref(false);

const credentials = reactive<AuthCredentials>({
  email: '',
  password: ''
});

/**
 * Gère la soumission du formulaire
 */
async function handleSubmit() {
  errorMessage.value = '';
  isLoading.value = true;
  
  try {
    const success = await authStore.login(credentials);
    
    if (success) {
      emit('login-success');
      if (props.redirectPath) {
        router.push(props.redirectPath);
      }
    } else {
      errorMessage.value = authStore.authError || 'Échec de la connexion';
      emit('login-error', errorMessage.value);
    }
  } catch (error: any) {
    errorMessage.value = error.message || 'Une erreur est survenue';
    emit('login-error', errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}

/**
 * Affiche/masque le mot de passe
 */
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}
</script>

<style scoped>
.auth-form {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 4px;
  font-size: 0.875rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 0.875rem;
}

.toggle-password:hover {
  color: #4f46e5;
}

.form-actions {
  margin-top: 2rem;
}

.submit-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #4338ca;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>
