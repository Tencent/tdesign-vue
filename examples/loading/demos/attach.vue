<template>
  <div class="tdesign-demo-block-column">
    <div id="alice" class="loading-attach-demo__title">Hello, I'm Alice.</div>
    <t-loading attach="#alice" size="small"></t-loading>
  </div>
</template>

<style scoped>
.loading-attach-demo__title {
  /** `position: relative` is required as a parent node */
  position: relative;
  width: 260px;
  height: 48px;
  line-height: 48px;
}
</style>
