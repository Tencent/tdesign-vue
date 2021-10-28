<template>
  <div class="tdesign-demo-block-column">
    <t-loading :loading="loading" fullscreen> </t-loading>
    <div>
      全局加载开关（开启加载1秒后自动归位）：
      <t-switch v-model="loading"></t-switch>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FullScrennLoading',
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
