<template>
  <div class="tdesign-demo-block-column">
    <div class="tdesign-demo-block-row">
      <t-tag :icon="renderDiscountIcon">默认标签</t-tag>
    </div>
    <div class="tdesign-demo-block-row">
      <t-tag>
        <template #icon>
          <discount-icon />
        </template>
        Icon插槽
      </t-tag>
    </div>
  </div>
</template>

<script lang="jsx">
import { DiscountIcon } from 'tdesign-icons-vue';

export default {
  components: { DiscountIcon },
  methods: {
    renderDiscountIcon() {
      return <DiscountIcon />;
    },
  },
};
</script>

<style lang="less">
</style>
