<template>
  <div class="not-found-bg">
    <div class="not-found-card">
      <span class="icon">🔍</span>
      <h1>404 - Página Não Encontrada</h1>
      <p>Desculpe, a página que você procura não existe.</p>
      <p class="funny-msg">Nem o Sherlock achou essa página! 🕵️‍♂️</p>
      <router-link to="/" class="home-link">Voltar para a Home</router-link>
    </div>
  </div>
</template>

<script lang="ts"></script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;500&display=swap');

.not-found-bg {
  min-height: 100vh;
  width: 100vw;
  background: #1565c0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.not-found-card {
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

.not-found-card h1 {
  font-size: 2.2em;
  margin-bottom: 10px;
  font-family: 'Montserrat', Arial, sans-serif;
  letter-spacing: 1px;
}

.not-found-card p {
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

.not-found-card .home-link {
  color: #1565c0;
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

.not-found-card .home-link:hover {
  background: #e3f2fd;
  color: #1565c0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
}
</style>
