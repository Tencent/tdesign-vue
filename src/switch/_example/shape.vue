<template>
  <t-space>
    <t-switch v-model="circleChecked" shape="circle"></t-switch>
    <t-switch v-model="roundChecked" shape="round"></t-switch>
    <t-switch v-model="lineChecked" shape="line"></t-switch>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      circleChecked: true,
      roundChecked: true,
      lineChecked: true,
    };
  },
};
</script>
