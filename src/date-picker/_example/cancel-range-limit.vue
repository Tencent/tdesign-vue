<template>
  <t-space direction="vertical">
    <t-date-range-picker v-model="range" cancel-range-select-limit />
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      range: ['', ''],
    };
  },
};
</script>
