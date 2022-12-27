<template>
  <t-space direction="vertical">
    <div v-loading="loading1" class="loading-container">Loading...</div>
    <t-button size="small" :disabled="loading1" @click="handleLoading"
    >支持指令 需所在节点设置position: relative</t-button
    >

    <div v-loading.fullscreen="loading2" class="loading-container">Loading...</div>
    <t-button size="small" :disabled="loading2" @click="handleLoadingFullscreen">支持 fullscreen 修饰符</t-button>
  </t-space>
</template>
<script>
export default {
  data() {
    return {
      loading1: false,
      loading2: false,
    };
  },
  methods: {
    handleLoading() {
      this.loading1 = true;
      const timer = setTimeout(() => {
        this.loading1 = false;
        clearTimeout(timer);
      }, 1000);
    },
    handleLoadingFullscreen() {
      this.loading2 = true;
      const timer = setTimeout(() => {
        this.loading2 = false;
        clearTimeout(timer);
      }, 1000);
    },
  },
};
</script>

<style>
.loading-container {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px var(--component-border, #eee) solid;
  position: relative;
}
</style>
