<template>
  <div class="q-pa-xl flex flex-center bg-primary" style="min-height: 100vh">
    <div
      class="q-pa-xl q-mx-auto q-gutter-md q-card text-white text-center"
      style="max-width: 420px; background: rgba(255, 255, 255, 0.1)"
    >
      <h1 class="text-h4 q-mt-md">Página Não Encontrada</h1>
      <p>Desculpe, a página que você procura não existe.</p>
      <p class="text-italic text-grey-3">Ta perdido? começa da HOME amigo.</p>
      <div class="flex flex-center q-my-md">
        <img
          src="src\assets\lost-svgrepo-com.svg"
          alt="Página Não Encontrada"
          width="100"
          height="100"
        />
      </div>
      <router-link
        to="/"
        class="q-btn q-btn--outline q-btn--rounded q-mt-md bg-white text-primary text-weight-bold"
        >Voltar para a Home</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Apenas estilos mínimos se necessário */
</style>
