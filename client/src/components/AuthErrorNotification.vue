<template>
  <div v-if="visible" class="auth-error-notification" :class="{ 'show': animateIn }">
    <div class="notification-content">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <div class="message-container">
        <h4>{{ title }}</h4>
        <p>{{ message }}</p>
      </div>
      <button @click="dismiss" class="close-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="timer-bar" :style="{ width: `${timerProgress}%` }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

interface Props {
  title?: string;
  message: string;
  duration?: number; // Durée en ms, 0 = pas de fermeture automatique
  visible: boolean;
}

type Emits = (e: 'dismiss') => void;

const props = withDefaults(defineProps<Props>(), {
  title: 'Erreur d\'authentification',
  duration: 5000
});

const emits = defineEmits<Emits>();

const animateIn = ref(false);
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

// Lancer l'animation d'entrée
onMounted(() => {
  if (props.visible) {
    setTimeout(() => {
      animateIn.value = true;
      startTimer();
    }, 10);
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
  animateIn.value = false;
  
  // Émettre l'événement après l'animation de sortie
  setTimeout(() => {
    emits('dismiss');
  }, 300);
}
</script>

<style scoped>
.auth-error-notification {
  position: fixed;
  top: 1rem;
  right: 1rem;
  max-width: 400px;
  width: calc(100% - 2rem);
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 9999;
  opacity: 0;
  transform: translateX(100%);
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.auth-error-notification.show {
  opacity: 1;
  transform: translateX(0);
}

.notification-content {
  display: flex;
  padding: 1rem;
  align-items: flex-start;
}

.error-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-right: 0.75rem;
  color: #ef4444;
}

.message-container {
  flex-grow: 1;
  padding-right: 0.5rem;
}

.message-container h4 {
  margin: 0 0 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.message-container p {
  margin: 0;
  font-size: 0.8125rem;
  color: #4b5563;
}

.close-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  padding: 0;
  color: #9ca3af;
  cursor: pointer;
}

.close-btn:hover {
  color: #1f2937;
}

.timer-bar {
  height: 3px;
  background-color: #ef4444;
  transition: width 0.1s linear;
}
</style>
