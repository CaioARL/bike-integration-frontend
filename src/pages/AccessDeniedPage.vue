<template>
  <div class="q-pa-xl flex flex-center bg-negative" style="min-height: 100vh">
    <div
      class="q-pa-xl q-mx-auto q-gutter-md q-card text-white text-center"
      style="max-width: 420px; background: rgba(255, 255, 255, 0.08)"
    >
      <h2 class="text-h4 q-mt-md">Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <p class="text-italic text-grey-3">Não tente hackear, pf.</p>
      <div class="flex flex-center q-my-md">
        <img src="src\assets\stop-svgrepo-com.svg" alt="Acesso Negado" width="100" height="100" />
      </div>
      <router-link
        to="/"
        class="q-btn q-btn--outline q-btn--rounded q-mt-md bg-white text-negative text-weight-bold"
        >Voltar para a Home</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica adicional necessária
</script>

<style scoped>
/* Apenas estilos mínimos se necessário */
</style>
