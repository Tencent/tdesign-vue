<template>
  <div class="tdesign-demo-block-row">
    <t-color-picker-panel v-model="color" disabled />
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: '#0052d9',
    };
  },
};
</script>
