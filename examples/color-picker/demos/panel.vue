<template>
  <div class="tdesign-demo-block-row">
    <t-color-picker-panel
      v-model="color"
      @change="handleChange"
      @palette-bar-change="handlePaletteChange"
      @recent-colors-change="handleRecentColorsChange"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: '#0052d9',
    };
  },
  methods: {
    handleChange(value, context) {
      console.log(value, context);
    },
    handlePaletteChange(context) {
      console.log('色相面板改变', context);
    },
    handleRecentColorsChange(value) {
      console.log('最近使用颜色改变', value);
    },
  },
};
</script>
