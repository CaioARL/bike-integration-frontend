<template>
  <q-page padding>
    <custom-home-bar
      :user-name="userName"
      :logged-in="isLoggedIn"
      @goToHome="goToHome"
      @goToEventos="goToEventos"
      @toggleLogin="toggleLogin"
      @logout="doLogout"
    />
    <div v-if="showHome">
      <custom-home-banner />
    </div>
    <div v-if="showEventos">
      <custom-evento-list />
    </div>
    <div v-if="showLogin">
      <custom-login-form @login="doLogin" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { getAccessToken, getUsername, logout } from 'src/services/authService';
import { notifyCustom } from 'src/services/notifyService';
import { onMounted, ref } from 'vue';

// Constants
const userName = ref<string | null>(null); // Nome do usuário logado
const isLoggedIn = ref(false); // Indica se o usuário está logado
const showHome = ref(true); // Indica se a home está visível
const showLogin = ref(false); // Indica se a seção de login está visível
const showEventos = ref(false); // Indica se a seção de eventos está visível

// Mounted
onMounted(() => {
  buildHome();
});

// Methods
const buildHome = () => {
  verifyToken();
  verifyUser();
};

const verifyToken = () => {
  const token = getAccessToken();
  isLoggedIn.value = !!token;
};

const verifyUser = () => {
  userName.value = getUsername();
  if (userName.value) {
    notifyCustom(`Bem-vindo(a), ${userName.value}!`, 'info', 'person');
  }
};

// Methods to toggle visibility
const goToHome = () => {
  showHome.value = true;
  showLogin.value = false;
  showEventos.value = false;
};

const goToEventos = () => {
  showEventos.value = true;
  showHome.value = false;
};

const toggleLogin = () => {
  showLogin.value = !showLogin.value;
  showHome.value = false;
  showEventos.value = false;
};

const doLogin = () => {
  showLogin.value = false;
  showHome.value = true;
  showEventos.value = false;
  isLoggedIn.value = true;
  userName.value = getUsername();
  notifyCustom(`Bem-vindo(a), ${userName.value}!`, 'info', 'person');
};

const doLogout = () => {
  logout();
  showHome.value = true;
  showLogin.value = false;
  showEventos.value = false;
  isLoggedIn.value = false;
  userName.value = null;
  notifyCustom('Você foi desconectado.', 'info', 'logout');
};

// const recreateHome = () => {
//   window.location.reload();
// };
</script>
