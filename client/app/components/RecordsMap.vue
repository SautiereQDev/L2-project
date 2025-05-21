<template>
  <div :style="{ height: props.height, width: '100%' }">
    <LMap
        ref="map"
        :zoom="zoom"
        :center="[props.lat, props.lng]"
    >
      <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
          layer-type=""
          name="OpenStreetMap"
      />
      <LMarker
          :lat-lng="[props.lat, props.lng]"
      >
        <LPopup>
          <div>
            <strong>{{ props.locationName }}</strong><br>
            {{ props.city }}, {{ props.country }}
          </div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
  locationName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    default: null
  },
  lng: {
    type: Number,
    default: null
  },
  height: {
    type: String,
    default: '300px'
  }
});

const zoom = ref(4)
</script>