<template>
  <div>
    <div>
      <div class="t-progress-domo-margin">默认样式</div>
      <t-progress theme="line" :percentage="30" ></t-progress>
      <div class="t-progress-domo-margin">100%</div>
      <t-progress theme="line" :percentage="100" ></t-progress>
      <div class="t-progress-domo-margin">进度完成</div>
      <t-progress theme="line" :status="'success'" :percentage="60" ></t-progress>
      <div class="t-progress-domo-margin">进度状态发生重大错误</div>
      <t-progress theme="line" :status="'error'" :percentage="60" ></t-progress>
      <div class="t-progress-domo-margin">进度被中断</div>

      <t-progress theme="line" :status="'warning'" :percentage="60" ></t-progress>
      <div class="t-progress-domo-margin">渐变色</div>
      <t-progress theme="line" :color="{ from: '#0052D9', to: '#00A870' }" :percentage="60" :status="'active'"></t-progress>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      style: { margin: '20px 0 10px' },
    };
  },
};
</script>
<style scoped>
.t-progress-domo-margin{
  margin: 10px 0 5px
}
</style>
