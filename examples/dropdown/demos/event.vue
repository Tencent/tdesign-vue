<template>
  <div>
    <t-dropdown :options="options" @click="clickHandler" :minColumnWidth="95">
      <t-button>hover我试试</t-button>
    </t-dropdown>
  </div>
</template>
<script>
export default {
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
      }, {
        content: '选项四',
        value: 4,
      }],
    };
  },
  methods: {
    clickHandler(data) {
      this.$message.success(`选中【${data.content}】`);
    },
  },
};
</script>
