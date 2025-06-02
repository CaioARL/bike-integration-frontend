<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="q-pa-md" height-hint="auto">
      <custom-home-bar
        :user-name="userName"
        :logged-in="isLoggedIn"
        @goToHome="goToHome"
        @goToEventos="goToEventos"
        @toggleLogin="toggleLogin"
        @logout="doLogout"
      />
    </q-header>
    <q-page-container>
      <div>
        <div v-if="showHome">
          <custom-home-banner />
        </div>
        <div v-if="showEventos">
          <custom-evento-list @unauthenticated="unauthenticated" />
        </div>
        <div v-if="showLogin">
          <custom-login-form @login="doLogin" />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { getAccessToken, getUsername, logout } from 'src/services/authService';
import { notifyCustom } from 'src/services/notifyService';
import { onMounted, ref } from 'vue';

// =====================
// ESTADO E CONSTANTES
// =====================
const userName = ref<string | null>(null); // Nome do usuário logado
const isLoggedIn = ref(false); // Indica se o usuário está logado
const showHome = ref(true); // Indica se a home está visível
const showLogin = ref(false); // Indica se a seção de login está visível
const showEventos = ref(false); // Indica se a seção de eventos está visível

// =====================
// CICLO DE VIDA
// =====================
onMounted(() => {
  buildHome();
  restoreScreen();
});

// =====================
// PERSISTÊNCIA DE TELA ATIVA
// =====================
const SCREEN_KEY = 'bike-active-screen';
function saveScreen(screen: 'home' | 'eventos' | 'login') {
  localStorage.setItem(SCREEN_KEY, screen);
}
function restoreScreen() {
  const screen = localStorage.getItem(SCREEN_KEY);
  if (screen === 'eventos') {
    showHome.value = false;
    showLogin.value = false;
    showEventos.value = true;
  } else if (screen === 'login') {
    showHome.value = false;
    showLogin.value = true;
    showEventos.value = false;
  } else {
    showHome.value = true;
    showLogin.value = false;
    showEventos.value = false;
  }
}

// =====================
// MÉTODOS DE INICIALIZAÇÃO
// =====================
const buildHome = () => {
  verifyToken();
};

const verifyToken = () => {
  const token = getAccessToken();
  isLoggedIn.value = !!token;
};

// =====================
// MÉTODOS DE VISIBILIDADE
// =====================
const goToHome = () => {
  showHome.value = true;
  showLogin.value = false;
  showEventos.value = false;
  saveScreen('home');
};

const goToEventos = () => {
  showEventos.value = !showEventos.value;
  showHome.value = !showEventos.value;
  showLogin.value = false;
  saveScreen(showEventos.value ? 'eventos' : 'home');
};

const toggleLogin = () => {
  showLogin.value = !showLogin.value;
  showHome.value = false;
  showEventos.value = false;
  saveScreen(showLogin.value ? 'login' : 'home');
};

// =====================
// AUTENTICAÇÃO E SESSÃO
// =====================
const unauthenticated = () => {
  showHome.value = false;
  showLogin.value = true;
  showEventos.value = false;
  isLoggedIn.value = false;
  userName.value = null;
  saveScreen('login');
  notifyCustom('Login expirado, por favor, faça login novamente.', 'warning', 'warning');
};

const doLogin = () => {
  showLogin.value = false;
  showHome.value = true;
  showEventos.value = false;
  isLoggedIn.value = true;
  userName.value = getUsername();
  saveScreen('home');
  notifyCustom(`Bem-vindo(a), ${userName.value}!`, 'info', 'person');
};

const doLogout = () => {
  logout();
  showHome.value = true;
  showLogin.value = false;
  showEventos.value = false;
  isLoggedIn.value = false;
  userName.value = null;
  saveScreen('home');
  notifyCustom('Você foi desconectado.', 'info', 'logout');
};
</script>

<style scoped>
body.body--dark .q-header {
  background-color: #121212;
}

body.body--light .q-header {
  background-color: #ffffff;
}
</style>
