<template>
  <div class="flex flex-center q-pt-xl">
    <q-card
      :class="isDark ? 'animated-gradient-dark' : 'animated-gradient-light'"
      class="q-pa-xl rounded-borders shadow-24 flex flex-column items-center justify-center"
      style="min-width: 300px; max-width: 90vw; max-height: 80vh; width: 100%"
    >
      <q-card-section class="flex flex-center">
        <img
          src="src/assets/home/bicity-logo.svg"
          alt="Bicity Logo"
          class="q-mb-md"
          style="max-width: 60vw; max-height: 25vh"
        />
      </q-card-section>
      <q-card-section class="flex flex-center flex-column q-pa-none">
        <div class="text-h3 text-bold text-center q-mb-xs">Bem-vindo ao BiCity!</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from 'src/composables/useTheme';

const { isDark } = useTheme();
</script>

<style scoped>
.animated-gradient-light {
  background: linear-gradient(300deg, #1c9b73, #72f7de, #1c9b73);
  background-size: 400% 400%;
  animation: gradientMove 6s ease infinite;
}

.animated-gradient-dark {
  background: linear-gradient(300deg, #0f2027, #283e51, #0f2027);
  background-size: 400% 400%;
  animation: gradientMove 6s ease infinite;
}

@keyframes gradientMove {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
