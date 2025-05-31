<template>
  <q-form @submit.prevent="submitEvent">
    <q-input v-model="event.nome" label="Nome" required />
    <q-input v-model="event.descricao" label="Descrição" required />
    <q-input v-model="event.data" type="datetime-local" label="Data" required />

    <q-input v-model="event.endereco.cep" label="CEP" required />
    <q-input v-model="event.endereco.estado" label="Estado" required />
    <q-input v-model="event.endereco.cidade" label="Cidade" required />
    <q-input v-model="event.endereco.bairro" label="Bairro" required />
    <q-input v-model="event.endereco.rua" label="Rua" required />
    <q-input v-model="event.endereco.numero" type="number" label="Número" required />

    <q-btn type="submit" label="Salvar" color="primary" />
  </q-form>
</template>

<script lang="ts"></script>

<style scoped>
/* Add any specific styles for the EventoForm component here */
</style>
