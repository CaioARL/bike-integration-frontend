<template>
  <div class="q-pa-md">
    <div class="row justify-center fixed-top">
      <q-btn flat round dense @click="() => emit('goToHome')" aria-label="Ir para a página inicial">
        <q-avatar size="80px">
          <img src="src/assets/bicity-logo.svg" alt="Logo" />
        </q-avatar>
      </q-btn>
      <q-tooltip anchor="bottom middle" self="bottom middle" :offset="[0, 10]">
        Ir para a página inicial
      </q-tooltip>
    </div>

    <q-btn-dropdown class="fixed-top-right" color="primary">
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <q-btn flat label="Eventos" @click="handleEventos">
            <q-icon class="material-symbols-outlined q-ml-sm">crowdsource</q-icon>
          </q-btn>
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center">
          <q-btn
            flat
            round
            dense
            :icon="isDark ? 'dark_mode' : 'light_mode'"
            @click="toggleDark"
            aria-label="Alternar tema escuro"
            class="q-mb-xl"
          />
          <q-avatar>
            <q-icon name="person" size="50px" />
          </q-avatar>
          <div class="text-subtitle1 q-mt-md q-mb-xs">{{ props.userName || '' }}</div>
          <q-btn
            color="primary"
            :label="props.loggedIn ? 'Sair' : 'Entrar'"
            @click="toggleLogin"
            :disable="showConfirm && props.loggedIn"
          />
        </div>
      </div>
      <q-dialog v-model="showConfirm">
        <q-card>
          <q-card-section class="row items-center">
            <q-icon name="warning" color="warning" size="md" class="q-mr-md" />
            <span>Tem certeza que deseja sair?</span>
          </q-card-section>
          <q-card-section>
            <q-linear-progress :value="progress" color="negative" instant-feedback />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="primary" v-close-popup @click="cancelLogout" />
            <q-btn flat label="Confirmar" color="negative" @click="confirmLogout" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-btn-dropdown>
  </div>
</template>

<script lang="ts" setup>
import { useQuasar } from 'quasar';
import { notifyCustom } from 'src/services/notifyService';
import { defineEmits, defineProps, ref, watchEffect } from 'vue';

const $q = useQuasar();
const isDark = ref($q.dark.isActive);

const emit = defineEmits<{
  (e: 'toggleLogin'): void;
  (e: 'goToEventos'): void;
  (e: 'goToHome'): void;
  (e: 'logout'): void;
}>();

const props = defineProps<{
  userName: string | null;
  loggedIn: boolean;
}>();

const showConfirm = ref(false);
const progress = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
const DURATION = 5000; // 5 segundos

function handleEventos() {
  if (!props.loggedIn) {
    notifyCustom('Você precisa estar logado para acessar eventos.', 'warning', 'lock');
    return;
  }
  emit('goToEventos');
}

function toggleDark() {
  $q.dark.set(!$q.dark.isActive);
  isDark.value = $q.dark.isActive;
}

watchEffect(() => {
  isDark.value = $q.dark.isActive;
});

function toggleLogin() {
  if (!props.loggedIn) {
    emit('toggleLogin');
    return;
  }
  if (showConfirm.value) return;

  showConfirm.value = true;
  let elapsed = 0;
  const interval = 100;
  timer = setInterval(() => {
    elapsed += interval;
    progress.value = elapsed / DURATION;
    if (elapsed >= DURATION) {
      cancelLogout();
    }
  }, interval);
}

function cancelLogout() {
  showConfirm.value = false;
  progress.value = 0;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function confirmLogout() {
  cancelLogout();
  emit('logout');
}
</script>

<style scoped></style>
