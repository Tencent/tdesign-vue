<template>
  <div class="tdesign-demo-dropdown">
    <t-dropdown :options="options" @click="clickHandler" :maxColumnWidth="120">
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
import { ChevronDownIcon } from 'tdesign-icons-vue';

export default {
  components: {
    ChevronDownIcon,
  },
  data() {
    return {
      options: [{
        content: '操作一',
        value: 1,
        children: [{
          content: '操作九',
          value: 9,
        }],
      }, {
        content: '操作二操作二操作二操作二',
        value: 2,
        children: [
          {
            content: '操作五',
            value: 5,
            children: [
              {
                content: '操作七',
                value: 7,

              }, {
                content: '操作八',
                value: 8,
              },
            ],
          }, {
            content: '操作六',
            value: 6,
          },
        ],
      }, {
        content: '操作三',
        value: 3,
        children: [{
          content: '操作十',
          value: 10,
        }],
      }, {
        content: '操作四',
        value: 4,
        children: [{
          content: '操作十一',
          value: 11,
        }],
      }],
    };
  },
  methods: {
    clickHandler(data, context) {
      console.log(data);
      console.log(context);
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
