<template>
  <div>
    <t-dropdown :options="options" :minColumnWidth="100">
      <t-button variant="text">更多 <t-icon name="chevron-down" size="14" /></t-button>
    </t-dropdown>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      options: [{
        content: '选项一',
        value: 1,
        children: [{
          content: '选项九',
          value: 9,
        }],
      }, {
        content: '选项二选项二选项二选项二',
        value: 2,
        children: [
          {
            content: '选项五',
            value: 5,
            children: [
              {
                content: '选项七',
                value: 7,

              }, {
                content: '选项八',
                value: 8,
              },
            ],
          }, {
            content: '选项六',
            value: 6,
          },
        ],
      }, {
        content: '选项三',
        value: 3,
        children: [{
          content: '选项十',
          value: 10,
        }],
      }, {
        content: '选项四',
        value: 4,
        children: [{
          content: '选项十一',
          value: 11,
        }],
      }],
    };
  },
});
</script>
