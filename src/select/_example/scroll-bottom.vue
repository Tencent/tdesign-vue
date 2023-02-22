<template>
  <t-space>
    <t-select
      style="width: 300px"
      :options="options"
      placeholder="请选择"
      :popup-props="{ 'on-scroll-to-bottom': handleScrollToBottom }"
    />
  </t-space>
</template>
<script>
const options = [];
for (let i = 1; i < 15; i++) {
  options.push({ label: `第 ${i} 项`, value: i });
}
export default {
  data() {
    return {
      options,
    };
  },
  methods: {
    // 通过监听scroll滚动事件自行判断
    handleScroll({ e }) {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollHeight - scrollTop === clientHeight) {
        console.log('到底部了');
        this.options = this.options.concat({
          label: `滚动新增选项${this.options.length + 1}`,
          value: this.options.length + 1,
        });
      }
    },

    handleScrollToBottom() {
      // 直接使用滚动触底事件
      this.options = this.options.concat({
        label: `滚动新增选项${this.options.length + 1}`,
        value: this.options.length + 1,
      });
    },
  },
};
</script>
