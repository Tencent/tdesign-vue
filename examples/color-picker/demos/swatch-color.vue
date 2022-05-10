<template>
  <div class="tdesign-demo-block-row">
    <div>
      <h6>自定义系统色</h6>
      <t-color-picker-panel v-model="color" :swatch-colors="systemColors" />
    </div>
    <div>
      <h6>完全不显示系统色</h6>
      <t-color-picker-panel v-model="color" :swatch-colors="null" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: '#0052d9',
      systemColors: ['red', 'green', 'yellow', 'blue', 'purple'],
    };
  },
};
</script>

<style scoped>
.tdesign-demo-block-row {
  align-items: flex-start;
}
h6 {
  margin-bottom: 10px;
}
</style>
