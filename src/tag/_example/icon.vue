<template>
  <t-space>
    <t-tag :icon="renderDiscountIcon">默认标签</t-tag>

    <t-tag>
      <template #icon>
        <discount-icon />
      </template>
      Icon插槽
    </t-tag>
  </t-space>
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
