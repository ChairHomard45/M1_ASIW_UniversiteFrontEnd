<script setup lang="ts">
const model = defineModel();

const props = defineProps<{
  id: string,
  libelle: string,
  type: string,
  placeholder: string | undefined,
  error: string | undefined | null,
}>();
</script>

<template>
  <div class="form-group">
    <label for="intitule">{{ libelle }} :</label>
    <input v-model="model" :class="{ 'form-control': true, 'is-invalid': error }" :type="type" :id="id"
           :placeholder="placeholder" />
    <div v-if="error" class="invalid-feedback">
      {{ error }}
    </div>
  </div>
</template>