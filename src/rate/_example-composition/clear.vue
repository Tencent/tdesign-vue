<template>
  <t-space direction="vertical">
    <h3>clearable: true</h3>
    <t-rate v-model="value1" clearable />
    <h3>clearable: false</h3>
    <t-rate v-model="value2" />
  </t-space>
</template>
<script setup>
import { ref } from 'vue';

const value1 = ref(3);
const value2 = ref(3);
</script>
