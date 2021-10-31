<template>
  <div class="tdesign-demo-dropdown">
    <t-dropdown :options="options" :popupProps={}>
      <t-button variant="text">
        <span class="tdesign-demo-dropdown__text">
          更多
          <chevron-down-icon size="16" />
        </span>
      </t-button>
    </t-dropdown>
  </div>
</template>
<script>
import Vue from 'vue';
import { ChevronDownIcon } from '@tencent/tdesign-icons-vue';

export default Vue.extend({
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      options: [{
        content: '选项一',
        value: 1,
      }, {
        content: '选项二',
        value: 2,
      }, {
        content: '选项三',
        value: 3,
        disabled: true,
      }, {
        content: '选项四',
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
