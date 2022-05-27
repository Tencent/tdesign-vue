<template>
  <div class="tdesign-demo-block-row">
    <t-color-picker v-model="color" disabled />
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: 'red',
    };
  },
};
</script>
