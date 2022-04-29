<template>
  <div>
    <t-tooltip default-visible :content="`提示在 ${timeout} 秒后消失`" :duration="5000" :key="renderId">
      <t-button variant="outline" :disabled="timeout" @click="renderId += 1">定时消失</t-button>
    </t-tooltip>
  </div>
</template>
<script>
export default {
  data() {
    return {
      timeout: 0,
      renderId: 0,
    };
  },
  watch: {
    renderId: {
      immediate: true,
      handler() {
        this.timeout = 5;
        this.timer = setInterval(() => {
          this.timeout -= 1;
          if (this.timeout <= 0) {
            clearInterval(this.timer);
          }
        }, 1000);
      },
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
};
</script>
