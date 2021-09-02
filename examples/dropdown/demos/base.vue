<template>
  <div class="tdesign-demo-dropdown">
    <t-dropdown :options="options" @click="clickHandler">
      <t-button variant="text">
        <span class="tdesign-demo-dropdown__text">
          更多
          <t-icon-chevron-down size="16" />
        </span>
      </t-button>
    </t-dropdown>
  </div>
</template>
<script>
import TIconChevronDown from '@tencent/tdesign-vue/lib/icon/chevron-down';

export default {
  components: {
    TIconChevronDown,
  },
  data() {
    return {
      options: [
        {
          content: '操作一',
          value: 1,
        },
        {
          content: '操作二',
          value: 2,
        },
        {
          content: '操作三',
          value: 3,
        },
        {
          content: '操作四',
          value: 4,
        },
      ],
    };
  },
  methods: {
    clickHandler(data) {
      this.$message.success(`选中【${data.content}】`);
    },
  },
};
</script>
<style lang="less" scoped>
.tdesign-demo-dropdown {
  &__text {
     display: inline-flex;
  }
}
</style>
