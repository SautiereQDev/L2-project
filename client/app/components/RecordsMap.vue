<template>
  <div :style="{ height: props.height, width: '100%' }">
    <LMap ref="map" :zoom="zoom" :center="validCoordinates">
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        layer-type=""
        name="OpenStreetMap"
      />
      <LMarker :lat-lng="validCoordinates">
        <LPopup>
          <div>
            <strong>{{ props.locationName }}</strong
            ><br />
            {{ props.city }}, {{ props.country }}
          </div>
        </LPopup>
      </LMarker>
    </LMap>
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
    default: 48.8566, // Paris par défaut
  },
  lng: {
    type: Number,
    default: 2.3522,  // Paris par défaut
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
