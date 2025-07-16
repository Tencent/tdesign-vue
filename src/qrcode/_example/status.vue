<template>
  <t-space>
    <t-qrcode value="https://tdesign.tencent.com/" status="loading" />
    <t-qrcode value="https://tdesign.tencent.com/" status="expired" :onRefresh="handleRefresh" />
    <t-qrcode value="https://tdesign.tencent.com/" status="scanned" />
  </t-space>
</template>

<script>
export default {
  methods: {
    handleRefresh() {
      console.log('Click Refresh');
    },
  },
};
</script>
