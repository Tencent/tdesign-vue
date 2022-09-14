<template>
  <t-space break-line>
    <t-switch size="large" v-model="checked1"></t-switch>
    <t-switch size="large" loading v-model="checked2"></t-switch>
    <t-switch size="large" disabled></t-switch>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      checked1: true,
      checked2: true,
    };
  },
};
</script>
