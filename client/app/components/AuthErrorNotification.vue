<template>
  <Transition
    enter-active-class="transform transition duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transform transition duration-300 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div
v-if="visible" 
         class="fixed top-4 right-4 max-w-md w-[calc(100%-2rem)] z-50 overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700">
      <div class="flex items-start p-4 gap-3 relative">
        <div class="flex-shrink-0">
          <ExclamationCircleIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
        </div>
        
        <div class="flex-1 pt-0.5">
          <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ message }}
          </p>
        </div>
        
        <div class="flex-shrink-0 self-start">
          <button 
            type="button"
            class="inline-flex rounded p-1.5 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            @click="dismiss"
          >
            <span class="sr-only">Fermer</span>
            <XMarkIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      
      <div 
        class="h-1 bg-red-500"
        :style="{ width: `${timerProgress}%`, transition: 'width 200ms linear' }"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid';

interface Props {
  title?: string;
  message: string;
  duration?: number; // Durée en ms, 0 = pas de fermeture automatique
  visible: boolean;
  type?: 'error' | 'warning' | 'info' | 'success';
}

type Emits = (e: 'dismiss') => void;

const props = withDefaults(defineProps<Props>(), {
  title: 'Erreur d\'authentification',
  duration: 5000,
  type: 'error'
});

const emits = defineEmits<Emits>();

const timerProgress = ref(100);
const timerId = ref<number | null>(null);
const startTime = ref<number>(0);

// Observer les changements de visibilité
watch(() => props.visible, (newValue) => {
  if (newValue) {
    startTimer();
  } else {
    stopTimer();
  }
});

// Lancer l'animation d'entrée et le timer
onMounted(() => {
  if (props.visible) {
    startTimer();
  }
});

// Nettoyer le timer quand le composant est détruit
onBeforeUnmount(() => {
  stopTimer();
});

// Démarrer le timer pour la fermeture automatique
function startTimer() {
  if (props.duration <= 0) return;
  
  stopTimer();
  startTime.value = Date.now();
  
  const updateProgress = () => {
    const elapsed = Date.now() - startTime.value;
    const remaining = Math.max(0, props.duration - elapsed);
    timerProgress.value = (remaining / props.duration) * 100;
    
    if (remaining > 0) {
      timerId.value = window.setTimeout(updateProgress, 50);
    } else {
      dismiss();
    }
  };
  
  updateProgress();
}

// Arrêter le timer
function stopTimer() {
  if (timerId.value !== null) {
    clearTimeout(timerId.value);
    timerId.value = null;
  }
}

// Fermer la notification
function dismiss() {
  stopTimer();
  emits('dismiss');
}
</script>
