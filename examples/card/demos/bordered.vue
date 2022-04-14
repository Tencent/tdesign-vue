<template>
  <div class="tdesign-demo-block">
    <t-card bordered :style="{ width: '400px' }"> {{ infoMessage }} </t-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      infoMessage: `这是一段很长很长很长很长很长很长很长很长很长很长很长很长
  很长很长很长很长很长很长很长很长很长很长很长很长很长很长
  很长很长很长很长很长很长很长很长很长很长很长很长很长很长
  很长很长很长很长很长很长很长很长很长很长很长的内容示例。`,
    };
  },
};
</script>
<style scoped>
.tdesign-demo-block /deep/ .t-card__actions {
  line-height: 24px;
}
</style>
