<template>
  <div class="network-error-bg">
    <div class="network-error-card">
      <span class="icon">📡</span>
      <h1>Erro de Conexão</h1>
      <p>Não foi possível conectar à rede. Verifique sua conexão e tente novamente.</p>
      <p class="funny-msg">A internet caiu mais rápido que sua dieta! 🍩</p>
      <router-link to="/" class="home-link">Voltar para a Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap');

.network-error-bg {
  min-height: 100vh;
  width: 100vw;
  background: #ff9800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.network-error-card {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  padding: 40px 32px;
  border-radius: 16px;
  font-family: 'Montserrat', 'Roboto', Arial, sans-serif;
  font-weight: bold;
  text-align: center;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.14);
  max-width: 420px;
  margin: 0 auto;
}

.icon {
  font-size: 3.5em;
  margin-bottom: 12px;
  display: block;
}

.network-error-card h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  font-family: 'Montserrat', Arial, sans-serif;
  letter-spacing: 1px;
}

.network-error-card p {
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

.network-error-card .home-link {
  color: #ff9800;
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

.network-error-card .home-link:hover {
  background: #fff3e0;
  color: #ff9800;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
</style>
