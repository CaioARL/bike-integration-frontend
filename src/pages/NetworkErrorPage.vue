<template>
  <div class="q-pa-xl flex flex-center bg-warning" style="min-height: 100vh">
    <div
      class="q-pa-xl q-mx-auto q-gutter-md q-card text-white text-center"
      style="max-width: 420px; background: rgba(255, 255, 255, 0.1)"
    >
      <h1 class="text-h4 q-mt-md text-black">Erro de Conexão</h1>
      <p class="text-black">
        Não foi possível conectar à rede. Verifique sua conexão e tente novamente.
      </p>
      <p class="text-italic text-black">Acho que tropessaram nos cabos</p>
      <div class="flex flex-center q-my-md">
        <img
          src="src\assets\error\fall-down-the-stairs-falling-down-svgrepo-com.svg"
          alt="Acesso Negado"
          width="100"
          height="100"
        />
      </div>
      <router-link
        to="/"
        class="q-btn q-btn--outline q-btn--rounded q-mt-md bg-white text-warning text-weight-bold text-black"
        >Voltar para a Home</router-link
      >
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Apenas estilos mínimos se necessário */
</style>
