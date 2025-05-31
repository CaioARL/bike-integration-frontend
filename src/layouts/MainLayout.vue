<template>
  <q-layout view="hHh lpR fFf">
    <template v-if="loading">
      <q-page-container>
        <q-page class="q-pa-md full-height flex flex-center">
          <div class="fullscreen text-center q-pa-md flex flex-center bg-primary text-white">
            <div>
              <div class="text-h5">
                <q-spinner color="white" size="7rem" class="q-mr-md" />
              </div>
            </div>
          </div>
        </q-page>
      </q-page-container>
    </template>

    <template v-if="!loading">
      <q-page-container>
        <router-view />
      </q-page-container>
    </template>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { isAuthenticated } from 'src/services/authService';

const loading = ref(true);

onMounted(async () => {
  try {
    await isAuthenticated();
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped lang="scss"></style>
