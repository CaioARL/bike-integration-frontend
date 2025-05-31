<template>
  <div class="error-card">
    <slot> Ocorreu um erro. </slot>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica adicional necessária
</script>

<style scoped>
.error-card {
  background-color: #ff5252;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
