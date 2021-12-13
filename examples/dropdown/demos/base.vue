<template>
  <div class="tdesign-demo-dropdown">
    <t-dropdown :options="options" @click="clickHandler" :minColumnWidth="112">
      <t-button variant="text">
        <span class="tdesign-demo-dropdown__text">
          下拉菜单
          <chevron-down-icon size="16" />
        </span>
      </t-button>
    </t-dropdown>
  </div>
</template>
<script lang="jsx">
import { ChevronDownIcon } from 'tdesign-icons-vue';

export default {
  components: {
    ChevronDownIcon,
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
          content: this.getContent,
          value: 4,
        },
      ],
    };
  },
  methods: {
    clickHandler(data) {
      this.$message.success(`选中【${data.value}】`);
    },
    getContent() {
      return <div>操作四</div>;
    },
  },
};
</script>
<style lang="less" scoped>
.tdesign-demo-dropdown {
  &__text {
     display: inline-flex;
     .t-icon {
        margin-left: 8px;
     }
  }
}
</style>
