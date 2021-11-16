<template>
  <div class="tdesign-demo-dropdown">
    <t-dropdown :options="options" :minColumnWidth="112">
      <t-button variant="text">
        <span class="tdesign-demo-dropdown__text">
          下拉菜单
          <chevron-down-icon size="16" />
        </span>
      </t-button>
    </t-dropdown>
  </div>
</template>
<script>
import Vue from 'vue';
import { ChevronDownIcon } from 'tdesign-icons-vue';

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      options: [{
        content: '操作一',
        value: 1,
      }, {
        content: '操作二',
        value: 2,
      }, {
        content: '操作三',
        value: 3,
        disabled: true,
      }, {
        content: '操作四',
        value: 4,
        disabled: true,
      }],
    };
  },
});
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
