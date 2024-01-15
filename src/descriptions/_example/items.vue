<template>
  <t-descriptions title="Shipping address" :items="items" :column="3" />
</template>

<script lang="jsx">
const items = [{ label: 'Name', content: 'TDesign' }];

export default {
  data() {
    return {
      items,
    };
  },
};
</script>

<!-- <template>
  <t-descriptions title="Shipping address" :items="items" />
</template>

<script setup>
import Base from './base.vue';
const items = [
  { label: 'Name', content: 'TDesign' },
  { label: Base, content: '139****0609' },
];
</script> -->
