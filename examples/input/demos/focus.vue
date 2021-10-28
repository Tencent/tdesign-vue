<template>
  <div class="tdesign-demo-block-column" style="max-width: 500px">
    <t-input placeholder="请输入内容" @focus="onFocus" />
  </div>
</template>
<script>
export default {
  methods: {
    onFocus() {
      console.log('focused');
    },
  },
};
</script>
