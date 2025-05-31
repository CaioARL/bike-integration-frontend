<template>
  <div class="q-pa-md flex flex-center" style="min-height: 300px">
    <q-card class="q-pa-lg shadow-2" style="width: 350px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6 text-center q-mb-md">Entrar</div>
        <q-tabs
          v-model="loginType"
          dense
          class="text-primary"
          align="justify"
          active-color="primary"
          indicator-color="primary"
          @update:model-value="onTabChange"
        >
          <q-tab name="username" label="Usuário" />
          <q-tab name="email" label="E-mail" />
        </q-tabs>
        <q-form @submit.prevent="onSubmit" class="q-mt-md" ref="formRef">
          <q-input
            v-if="loginType === 'username'"
            v-model="request.nomeUsuario"
            label="Usuário"
            outlined
            dense
            :rules="showRules ? [(val) => !!val || 'Informe o usuário'] : []"
            class="q-mb-md"
            autofocus
          >
            <template #prepend>
              <q-icon name="person" />
            </template>
          </q-input>
          <q-input
            v-else
            v-model="request.email"
            label="E-mail"
            type="email"
            outlined
            dense
            :rules="showRules ? [(val) => !!val || 'Informe o e-mail'] : []"
            class="q-mb-md"
            autofocus
          >
            <template #prepend>
              <q-icon name="email" />
            </template>
          </q-input>
          <q-input
            v-model="request.senha"
            :type="showPassword ? 'text' : 'password'"
            label="Senha"
            outlined
            dense
            :rules="showRules ? [(val) => !!val || 'Informe a senha'] : []"
            class="q-mb-md"
          >
            <template #prepend>
              <q-icon name="lock" />
            </template>
            <template #append>
              <q-btn
                flat
                dense
                round
                :icon="showPassword ? 'visibility_off' : 'visibility'"
                @click="showPassword = !showPassword"
                tabindex="-1"
                aria-label="Mostrar ou ocultar senha"
              />
            </template>
          </q-input>
          <q-btn
            label="Entrar"
            color="primary"
            type="submit"
            class="full-width q-mt-sm"
            unelevated
          />
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import type { AuthRequest } from 'src/models/request/AuthRequest';
import { getBikeAccessToken } from 'src/services/authService';
import { notifyCustom } from 'src/services/notifyService';
import { defineEmits, ref } from 'vue';

const loginType = ref<'username' | 'email'>('username');
const showPassword = ref(false);
const showRules = ref(false);
const formRef = ref();
const request = ref<AuthRequest>({
  nomeUsuario: '',
  email: '',
  senha: '',
});

const emit = defineEmits<{
  (e: 'login'): void;
}>();

function onTabChange() {
  showRules.value = false;
  if (formRef.value) {
    formRef.value.resetValidation();
  }
}

async function onSubmit() {
  showRules.value = true;
  const valid = await formRef.value.validate();
  if (!valid) return;

  try {
    await getBikeAccessToken(request.value);
    emit('login');
  } catch (error) {
    notifyCustom('Erro ao realizar login. Verifique suas credenciais.', 'negative', 'error');
    console.error('Login error:', error);
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 16px;
}
</style>
