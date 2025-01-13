<script setup lang="ts">

import { defineProps } from 'vue';

defineProps({
  isOpen: {
    type: Object as () => bool,
    required: true
  },
  width: {
    type: Object as () => string | null,
    required: false,
    default: null,
  },
});
</script>

<template>
  <div v-if="isOpen" class="custom-modal">
    <div class="card new-parcours" :style="{ 'width': width ?? 'auto' }">
      <div class="card-header" style="background: #273656">
        <slot name="title"></slot>
      </div>
      <div class="card-body">
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>



<style scoped>
    .custom-modal {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background-color: rgba(87, 86, 86, 0.5);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .card-header {
      background: #273656;
      color: white;
      text-align: left;
    }
</style>