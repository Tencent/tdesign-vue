<template>
  <div>
    <div id="loading-service-demo" class="loading-service-demo">我是service的容器</div>
    <t-button @click="showFullScreen" size="small">服务方式加载（全屏）</t-button>
    <t-button @click="showAttach" class="t-loading__btn" size="small" :disabled="attachLoading"
    >服务方式加载（局部）</t-button
    >
  </div>
</template>
<script>
export default {
  name: 'LoadingPlugin',
  data() {
    return {
      loadingAttachInstance: null,
      attachLoading: false,
    };
  },
  methods: {
    showFullScreen() {
      this.$loading(true);
      const timer = setTimeout(() => {
        this.$loading(false);
        clearTimeout(timer);
      }, 1000);
    },
    showAttach() {
      this.loadingAttachInstance = this.$loading({
        attach: '#loading-service-demo',
        showOverlay: true,
      });
      this.attachLoading = true;
      const timer = setTimeout(() => {
        this.loadingAttachInstance.hide();
        this.attachLoading = false;
        clearTimeout(timer);
      }, 1000);
    },
  },
};
</script>
<style scoped>
.loading-service-demo {
  position: relative;
  width: 100%;
  height: 64px;
  border: 1px #fafafa solid;
  text-align: center;
  padding: 12px;
  margin-bottom: 12px;
}

div .t-button + .t-button {
  margin-left: 24px;
}
</style>
