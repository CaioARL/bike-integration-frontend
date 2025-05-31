<template>
  <div class="flex flex-center min-h-screen q-pa-sm">
    <div
      :class="[
        'row items-center justify-center q-pa-xl q-gutter-x-lg rounded-borders shadow-24',
        isDark ? 'animated-gradient-dark' : 'animated-gradient-light',
      ]"
      style="min-width: 300px; max-width: 90vw; max-height: 80vh; width: 100%"
    >
      <img
        src="src/assets/bicity-logo.svg"
        alt="Bicity Logo"
        class="q-mb-md"
        style="max-width: 60vw; max-height: 25vh"
      />
      <div>
        <h1 class="q-mb-xs text-h3 text-bold">Bem-vindo ao BiCity!</h1>
        <p class="text-subtitle1">
          O app feito para quem pedala: eventos e integração para ciclistas.
        </p>
      </div>
    </div>
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
