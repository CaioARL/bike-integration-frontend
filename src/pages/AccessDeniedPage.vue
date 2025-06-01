<template>
  <div class="access-denied-bg">
    <div class="access-denied-card">
      <span class="icon">🚫</span>
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <p class="funny-msg">Nem tente hackear, já chamamos o Batman! 🦇</p>
      <router-link to="/" class="home-link">Voltar para a Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Nenhuma lógica adicional necessária
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap');

.access-denied-bg {
  min-height: 100vh;
  width: 100vw;
  background: #b71c1c;
  display: flex;
  align-items: center;
  justify-content: center;
}

.access-denied-card {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 40px 32px;
  border-radius: 16px;
  font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.18);
  max-width: 420px;
  margin: 0 auto;
}

.icon {
  font-size: 3.5em;
  margin-bottom: 12px;
  display: block;
}

.access-denied-card h2 {
  font-size: 2.2em;
  margin-bottom: 10px;
  font-family: 'Montserrat', Arial, sans-serif;
  letter-spacing: 1px;
}

.access-denied-card p {
  font-size: 1.15em;
  margin-bottom: 12px;
  font-family: 'Roboto', Arial, sans-serif;
  font-weight: 400;
}

.funny-msg {
  font-size: 1em;
  margin-bottom: 22px;
  font-style: italic;
  opacity: 0.95;
}

.access-denied-card .home-link {
  color: #b71c1c;
  background: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  border: none;
  font-family: 'Montserrat', Arial, sans-serif;
  font-size: 1em;
  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  display: inline-block;
}

.access-denied-card .home-link:hover {
  background: #fff3f3;
  color: #b71c1c;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
</style>
