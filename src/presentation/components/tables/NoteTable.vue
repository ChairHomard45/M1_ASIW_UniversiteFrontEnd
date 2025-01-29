<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
  idAttribute: string;
  type: 'table' | 'tableInv';
  columns: {
    field: string;
    style: string | null;
    label: string;
    formatter: Function | null;
    onClick: Function | null;
  }[];
  data: any[];
}>();
</script>

<template>
  <table class="table table-striped">
    <thead v-if="type === 'table'">
    <tr>
      <th v-for="column in columns" :key="column.field" :style="column.style">
        <div>{{ column.label }}</div>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in data" :key="item[idAttribute]">
      <td
        v-for="column in columns"
        :key="column.field"
        :style="column.style"
        @click="column.onClick ? column.onClick(item) : () => {}"
      >
          <span :class="{ clickable: column.onClick }">
            <!-- Render custom slot for column -->
            <template v-if="column.formatter">
              <!-- Use v-slot to pass the item to formatter -->
              <slot :name="column.field" :item="item"></slot>
            </template>
            <template v-else>
              {{ item[column.field] }}
            </template>
          </span>
      </td>
    </tr>
    </tbody>
  </table>
</template>


<style scoped>
.clickable {
  cursor: pointer;
}
</style>