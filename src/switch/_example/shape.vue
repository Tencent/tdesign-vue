<template>
  <t-space>
    <t-switch v-model="checked" shape="circle"></t-switch>
    <t-switch v-model="checked" shape="round"></t-switch>
    <t-switch v-model="checked" shape="line"></t-switch>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      checked: true,
    };
  },
};
</script>
