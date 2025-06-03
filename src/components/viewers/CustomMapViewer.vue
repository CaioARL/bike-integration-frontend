<template>
  <div class="q-pa-md">
    <q-card flat bordered>
      <q-card-section>
        <div :id="mapId" class="map-viewer"></div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted, nextTick } from 'vue';

// Props
const props = defineProps<{
  latitude?: number;
  longitude?: number;
  nomeEvento?: string;
}>();

const mapId = `map-viewer-${Math.random().toString(36).substr(2, 9)}`;

onMounted(async () => {
  await nextTick();
  if (props.latitude !== undefined && props.longitude !== undefined) {
    const map = L.map(mapId).setView([props.latitude, props.longitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    L.marker([props.latitude, props.longitude]).addTo(map).bindPopup(props.nomeEvento).openPopup();
  }
});
</script>

<style scoped>
.map-viewer {
  width: 100%;
  height: 40vh;
}
</style>
