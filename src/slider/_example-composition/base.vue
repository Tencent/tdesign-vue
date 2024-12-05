<template>
  <t-space direction="vertical" size="60px">
    <t-slider v-model="value1" @change-end="handleChangeEnd" />
    <t-slider :value="value2" range :tooltipProps="tooltipProps" :label="renderLabel" @change="handleChange" />
  </t-space>
</template>
<script setup>
import { ref, reactive } from 'vue';

const value1 = ref(12);
const value2 = ref([30, 70]);
const tooltipProps = reactive({});
const renderLabel = (h, { value, position }) => {
  console.log(`the position is ${position}`);
  return `${value}`;
};
const handleChangeEnd = (endValue) => {
  console.log('the change end value is:', endValue);
};
const handleChange = (v) => {
  if (v[1] <= 80) {
    value2.value = v;
  }
};
</script>
