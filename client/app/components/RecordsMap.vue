<template>
  <div :style="{ height: props.height, width: '100%' }">
    <ClientOnly>
    <LMap
      ref="map"
      :zoom="zoom"
      :center="validCoordinates"
      :use-global-leaflet="false"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
        layer-type="base"
        name="OpenStreetMap"
      />
      <LMarker :lat-lng="validCoordinates"/>
    </LMap>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  locationName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  height: {
    type: String,
    default: "300px",
  },
});

// S'assurer que les coordonnées sont valides
const validCoordinates = computed(() => {
  // Vérifier si lat et lng sont des nombres valides
  const validLat = typeof props.lat === 'number' && !isNaN(props.lat) ? props.lat : 48.8566;
  const validLng = typeof props.lng === 'number' && !isNaN(props.lng) ? props.lng : 2.3522;
  
  return [validLat, validLng];
});

const zoom = ref(4);
</script>
