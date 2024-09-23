<template>
  <t-space direction="vertical">
    <h3>clearable: true</h3>
    <t-rate v-model="value1" clearable />
    <h3>clearable: false</h3>
    <t-rate v-model="value2" />
  </t-space>
</template>
<script>
export default {
  data() {
    return {
      value1: 3,
      value2: 3,
    };
  },
};
</script>
