<template>
  <q-page class="flex flex-center">
    <div class="access-denied-card">
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// Nenhuma lógica adicional necessária
</script>

<style scoped>
.access-denied-card {
  background-color: #ff5252;
  color: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
</style>
