<template>
  <t-space :size="10">
    <t-button variant="outline" @click="showInOffset">偏移的信息</t-button>
    <t-button variant="outline" @click="showInOffset2">偏移的信息</t-button>
  </t-space>
</template>

<script>
export default {
  methods: {
    showInOffset() {
      this.$notify({
        title: '标题名称',
        content: '这是一条可以自动关闭的消息通知',
        offset: [30, 30],
        duration: 3000,
      });
    },
    showInOffset2() {
      this.$notify({
        title: '标题名称',
        content: '这是一条可以自动关闭的消息通知',
        placement: 'top-left',
        offset: [30, 30],
        duration: 3000,
      });
    },
  },
};
</script>
