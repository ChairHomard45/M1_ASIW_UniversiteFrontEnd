<script setup lang="ts">
import { BootstrapButtonTypes } from '@/presentation/enums/BootstrapButtonTypes';
import { computed, defineProps } from 'vue';

const props = defineProps<{
  color: BootstrapButtonTypes
}>();

const buttonClasses = computed(() => {

  return {
    'btn': true,
    [props.color]: true
  }
});
</script>

<template>
  <button type="button" :class="buttonClasses">
    <slot />
  </button>
</template>