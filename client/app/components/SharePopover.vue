<template>
  <div class="share-popover">
    <UTooltip :text="isOpen ? 'Fermer' : 'Partager'" :popper="{ arrow: true }">
      <UButton
        :icon="isOpen ? 'i-heroicons-x-mark' : 'i-heroicons-share'"
        :color="isOpen ? 'primary' : 'secondary'"
        :variant="isOpen ? 'solid' : 'ghost'"
        square
        @click="togglePopover"
      />
    </UTooltip>
    
    <Transition name="fade-scale">
      <div v-if="isOpen" class="share-popover__content">
        <h3 class="text-sm font-medium mb-2">Partager</h3>
        <div class="flex space-x-2">
          <UButton
            v-for="option in shareOptions"
            :key="option.id"
            color="primary"
            :icon="option.icon"
            :title="option.label"
            square
            variant="soft"
            size="xs"
            @click="shareVia(option.id)"
          />
        </div>
        
        <UDivider class="my-2" />
        
        <div class="flex items-center">
          <UInput
            v-model="shareUrl"
            class="w-full text-xs cursor-pointer"
            readonly
            size="xs"
          >
            <template #trailing>
              <UTooltip :text="copied ? 'Copié!' : 'Copier'" :popper="{ arrow: true }">
                <UButton
                  v-if="!copied"
                  color="secondary"
                  variant="ghost" 
                  icon="i-heroicons-clipboard"
                  size="xs"
                  class="mr-0.5"
                  @click="copyToClipboard"
                />
                <UButton
                  v-else
                  color="success"
                  variant="ghost" 
                  icon="i-heroicons-check"
                  size="xs"
                  class="mr-0.5"
                />
              </UTooltip>
            </template>
          </UInput>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAppToast } from '~/composables/useAppToast';

const props = defineProps({
  /**
   * URL à partager
   */
  url: {
    type: String,
    default: ''
  },
  /**
   * Titre pour le partage
   */
  title: {
    type: String,
    default: 'Partager ce contenu'
  }
});

// État local
const isOpen = ref(false);
const copied = ref(false);
const shareUrl = ref('');
const toast = useAppToast();

// Options de partage
const shareOptions = [
  {
    id: 'facebook',
    label: 'Facebook',
    icon: 'i-heroicons-bookmark',
    color: 'primary'
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: 'i-heroicons-chat-bubble-left-right',
    color: 'info'
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'i-heroicons-chat-bubble-oval-left-ellipsis',
    color: 'success'
  },
  {
    id: 'email',
    label: 'Email',
    icon: 'i-heroicons-envelope',
    color: 'warning'
  },
  {
    id: 'system',
    label: 'Système',
    icon: 'i-heroicons-share',
    color: 'primary'
  }
];

// Initialisation
onMounted(() => {
  // Utiliser l'URL fournie ou l'URL actuelle
  shareUrl.value = props.url || window.location.href;
  
  // Ajouter un écouteur de clic global pour fermer le popover
  document.addEventListener('click', handleClickOutside);
});

// Nettoyage
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Gérer la fermeture du popover lors d'un clic à l'extérieur
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  const sharePopover = document.querySelector('.share-popover') as Element;
  
  if (isOpen.value && sharePopover && !sharePopover.contains(target)) {
    isOpen.value = false;
  }
}

// Toggle du popover
function togglePopover() {
  isOpen.value = !isOpen.value;
  
  // Réinitialiser l'état de copie
  if (isOpen.value) {
    copied.value = false;
  }
}

// Copier l'URL dans le presse-papiers
function copyToClipboard() {
  navigator.clipboard.writeText(shareUrl.value).then(() => {
    copied.value = true;
    toast.success('Lien copié dans le presse-papiers');
    
    // Réinitialiser après 2 secondes
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  }).catch(err => {
    console.error('Erreur lors de la copie:', err);
    toast.error('Impossible de copier le lien');
  });
}

// Partager via différentes méthodes
function shareVia(platform: string) {
  const encodedUrl = encodeURIComponent(shareUrl.value);
  const encodedTitle = encodeURIComponent(props.title);
  
  let shareUrlString: string = '';
  
  switch (platform) {
    case 'facebook':
      shareUrlString = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      break;
    case 'twitter':
      shareUrlString = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
      break;
    case 'whatsapp':
      shareUrlString = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`;
      break;
    case 'email':
      shareUrlString = `mailto:?subject=${encodedTitle}&body=${encodedUrl}`;
      break;
    case 'system':
      // Utiliser l'API Web Share si disponible
      if (navigator.share) {
        navigator.share({
          title: props.title,
          url: shareUrl.value
        }).catch(err => {
          console.error('Erreur lors du partage:', err);
          toast.error('Impossible de partager');
        });
        return;
      } else {
        // Fallback si l'API Web Share n'est pas disponible
        copyToClipboard();
        return;
      }
  }
  
  // Ouvrir l'URL de partage dans une nouvelle fenêtre pour les méthodes externes
  if (shareUrlString) {
    window.open(shareUrlString, '_blank', 'width=600,height=400');
    isOpen.value = false;
  }
}
</script>

<style scoped>
.share-popover {
  position: relative;
}

.share-popover__content {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  width: 220px;
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
}

.dark .share-popover__content {
  background-color: #1f2937;
}

/* Animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: top right;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
