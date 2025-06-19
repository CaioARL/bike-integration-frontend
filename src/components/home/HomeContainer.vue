<template>
  <custom-home-banner />
  <custom-home-content @join-community="joinCommunity"></custom-home-content>
</template>

<script lang="ts" setup>
const joinCommunity = () => {
  window.location.href = 'https://google.com';
};
</script>

<style scoped lang="scss"></style>
