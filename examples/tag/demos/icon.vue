<template>
  <div class="tdesign-tag-icon">
    <t-tag :icon="renderDiscountIcon">默认标签</t-tag>
  </div>
</template>

<script>
import { DiscountIcon } from '@tencent/tdesign-icons-vue';

export default {
  methods: {
    renderDiscountIcon() {
      return <DiscountIcon />;
    },
  },
};
</script>

<style lang="less">
</style>
