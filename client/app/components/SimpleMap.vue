<template>
  <div class="simple-map" :class="{ 'simple-map--loading': loading }">
    <!-- Loading state -->
    <div v-if="loading" class="simple-map__loading">
      <UIcon name="i-heroicons-map" class="h-10 w-10 text-gray-300 animate-pulse" />
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="simple-map__error">
      <UIcon name="i-heroicons-exclamation-triangle" class="h-8 w-8 text-warning-500 mb-2" />
      <div class="text-sm text-gray-500 dark:text-gray-400">
        La carte n'a pas pu être chargée
      </div>
    </div>
    
    <!-- Map -->
    <div v-else ref="mapContainer" class="simple-map__container"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  /**
   * Nom du lieu
   */
  locationName: {
    type: String,
    required: true
  },
  /**
   * Ville
   */
  city: {
    type: String,
    required: true
  },
  /**
   * Pays
   */
  country: {
    type: String,
    required: true
  },
  /**
   * Latitude (optionnelle)
   */
  lat: {
    type: Number,
    default: null
  },
  /**
   * Longitude (optionnelle)
   */
  lng: {
    type: Number,
    default: null
  },
  /**
   * Hauteur de la carte
   */
  height: {
    type: String,
    default: '300px'
  }
});

const mapContainer = ref<HTMLElement | null>(null);
const loading = ref(true);
const error = ref(false);
const mapInstance = ref<any>(null);
const mapTimeout = ref<number | null>(null);

// Simuler le chargement de la carte
onMounted(() => {
  initMap();
});

// Nettoyer les ressources
onUnmounted(() => {
  if (mapTimeout.value) {
    clearTimeout(mapTimeout.value);
  }
  
  if (mapInstance.value) {
    // Code de nettoyage de la carte (dans une vraie implémentation)
    mapInstance.value = null;
  }
});

// Recharger la carte si les props changent
watch(
  () => [props.lat, props.lng, props.city, props.country],
  () => {
    if (mapInstance.value) {
      updateMap();
    }
  }
);

// Dans une vraie application, initialiser la carte avec une bibliothèque comme Leaflet ou Google Maps
function initMap() {
  if (!mapContainer.value) return;
  
  loading.value = true;
  error.value = false;
  
  try {
    // Simuler le chargement de la carte (à remplacer par une vraie implémentation)
    mapTimeout.value = window.setTimeout(() => {
      renderSimpleMap();
      loading.value = false;
    }, 800);
  } catch (e) {
    console.error('Erreur lors du chargement de la carte', e);
    loading.value = false;
    error.value = true;
  }
}

// Mettre à jour la carte quand les paramètres changent
function updateMap() {
  if (!mapInstance.value || !mapContainer.value) return;
  
  try {
    // Dans une vraie application, mettre à jour la vue de la carte
    // Par exemple: mapInstance.setView([props.lat, props.lng], 13);
    renderSimpleMap();
  } catch (e) {
    console.error('Erreur lors de la mise à jour de la carte', e);
    error.value = true;
  }
}

// Rendu d'une carte simplifiée (simulée)
function renderSimpleMap() {
  if (!mapContainer.value) return;
  
  // Vider le conteneur
  mapContainer.value.innerHTML = '';
  
  // Créer une simulation de carte simple
  const mapElement = document.createElement('div');
  mapElement.className = 'w-full h-full relative bg-blue-50 dark:bg-blue-950/70 overflow-hidden';
  
  // Grid pour simuler une carte
  const grid = document.createElement('div');
  grid.className = 'absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-30 dark:opacity-20';
  
  // Créer un motif de grille pour simuler une carte
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.className = 'border border-blue-200 dark:border-blue-800';
    grid.appendChild(cell);
  }
  
  // Créer quelques "rues"
  const street1 = document.createElement('div');
  street1.className = 'absolute top-1/4 left-0 right-0 h-1 bg-blue-300 dark:bg-blue-700';
  
  const street2 = document.createElement('div');
  street2.className = 'absolute top-3/4 left-0 right-0 h-1 bg-blue-300 dark:bg-blue-700';
  
  const street3 = document.createElement('div');
  street3.className = 'absolute left-1/3 top-0 bottom-0 w-1 bg-blue-300 dark:bg-blue-700';
  
  const street4 = document.createElement('div');
  street4.className = 'absolute left-2/3 top-0 bottom-0 w-1 bg-blue-300 dark:bg-blue-700';
  
  // Créer un marqueur pour le stade
  const marker = document.createElement('div');
  marker.className = 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary-500 border-2 border-white dark:border-gray-800 flex items-center justify-center z-10 shadow-lg animate-bounce';
  
  // Ajouter un point pulsant
  const pulse = document.createElement('div');
  pulse.className = 'absolute w-12 h-12 rounded-full bg-primary-500/30 animate-ping';
  marker.appendChild(pulse);
  
  // Ajouter une icône au marqueur
  const markerIcon = document.createElement('div');
  markerIcon.className = 'text-white text-xs';
  markerIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-3 h-3"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"></path></svg>';
  marker.appendChild(markerIcon);
  
  // Légende de la carte
  const overlay = document.createElement('div');
  overlay.className = 'absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 p-2 text-center text-xs font-medium text-primary-700 dark:text-primary-300';
  overlay.textContent = `${props.locationName} - ${props.city}, ${props.country}`;
  
  // Watermark
  const watermark = document.createElement('div');
  watermark.className = 'absolute bottom-0 right-0 m-1 text-[8px] opacity-50 text-gray-500';
  watermark.textContent = 'Carte simulée';
  
  // Assembler tous les éléments
  mapElement.appendChild(grid);
  mapElement.appendChild(street1);
  mapElement.appendChild(street2);
  mapElement.appendChild(street3);
  mapElement.appendChild(street4);
  mapElement.appendChild(marker);
  mapElement.appendChild(overlay);
  mapElement.appendChild(watermark);
  
  mapContainer.value.appendChild(mapElement);
  
  // Simuler un objet de carte pour référence future
  mapInstance.value = { initialized: true };
}
</script>

<style scoped>
.simple-map {
  width: 100%;
  height: v-bind('props.height');
  position: relative;
  overflow: hidden;
}

.simple-map--loading {
  background-color: rgba(243, 244, 246, 0.5);
}

.simple-map__loading,
.simple-map__error {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.simple-map__container {
  width: 100%;
  height: 100%;
}
</style>
