<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './presentation/components/navigation/NavBar.vue'
</script>

<template>
  <main>
    <div class="application d-flex flex-nowrap">
      <NavBar />
      <RouterView class="content" />
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  max-height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
}

main .application {
  height: 100%;
  width: 100%;
}

.content {
  flex-grow: 1;
  padding: 15px 10px;
}
</style>
