<template>
  <t-space direction="vertical" size="60px">
    <t-slider v-model="value1" :show-tooltip="true" :marks="marks1" />
    <t-slider v-model="value2" range :show-tooltip="true" :marks="marks2" />
  </t-space>
</template>
<script setup lang="jsx">
import { ref, reactive } from 'vue';

const value1 = ref(12);
const value2 = ref([30, 70]);
const marks1 = reactive({
  0: '0°C',
  20: '20°C',
  40: '40°C',
  60: '60°C',
  80: <span style="color: #0052d9">80°C</span>,
  100: <span style="color: #0052d9">100°C</span>,
});
const marks2 = reactive({
  0: '0°C',
  20: '20°C',
  40: '40°C',
  60: '60°C',
  80: <span style="color: #0052d9">80°C</span>,
  100: '100°C',
});
</script>
<style>
.block {
  padding: 30px 24px;
}
</style>
