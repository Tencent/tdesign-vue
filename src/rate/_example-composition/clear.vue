<template>
  <t-space direction="vertical">
    <h3>allowClear: true</h3>
    <t-rate v-model="value1" allowClear />
    <h3>allowClear: false</h3>
    <t-rate v-model="value2" />
  </t-space>
</template>
<script setup>
import { ref } from 'vue';

const value1 = ref(3);
const value2 = ref(3);
</script>
