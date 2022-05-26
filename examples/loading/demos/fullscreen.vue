<template>
  <div class="tdesign-demo-block-column">
    <t-loading :loading="loading" text="加载中..." fullscreen />
    <!-- <t-loading :loading="loading" text="加载中..." attach="body" fullscreen /> -->

    <div>
      全局加载开关（开启加载1秒后自动归位）：
      <t-switch v-model="loading"></t-switch>
    </div>

    <!-- 绑定到任意元素 -->
    <!-- <div id="alice" class="loading-attach-demo__title">Hello, I'm Alice.</div> -->
    <!-- <t-loading :loading="loading" text="加载中..." attach="#alice" fullscreen /> -->
  </div>
</template>
<script>
export default {
  name: 'FullScreenLoading',
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    loading(v) {
      if (v) {
        const timer = setTimeout(() => {
          this.loading = false;
          clearTimeout(timer);
        }, 1000);
      }
    },
  },
};
</script>
