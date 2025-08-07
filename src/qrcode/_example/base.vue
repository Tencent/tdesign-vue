<template>
  <div style="width: 100%">
    <t-space direction="vertical" align="center">
      <t-qrcode :value="text || '-'" />
      <t-input v-model="text" placeholder="-" />
    </t-space>
  </div>
</template>

<script>
export default {
  data() {
    return {
      text: 'https://tdesign.tencent.com/',
    };
  },
};
</script>
