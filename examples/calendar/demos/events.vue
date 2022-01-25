<template>
  <div class="tdesign-demo-block-column-large">
    <t-calendar
      @cell-click="cellClick"
      @cell-double-click="cellDoubleClick"
      @cell-right-click="cellRightClick"
      @month-change="monthChange"
      @controller-change="controllerChange"
    ></t-calendar>
  </div>
</template>

<script>
export default {
  methods: {
    cellClick(options) {
      console.log(`鼠标左键单击单元格 ${options.cell.formattedDate}`);
    },
    cellDoubleClick(options) {
      console.log(`鼠标双击单元格 ${options.cell.formattedDate}`);
    },
    cellRightClick(options) {
      console.log(`鼠标右键点击元格 ${options.cell.formattedDate}`);
    },
    monthChange(options) {
      console.log(`月份切换 ${options.year}-${options.month}`);
    },
    controllerChange(data) {
      console.log('控件值变化', data);
    },
  },
};
</script>

<style scoped>
.demo-list {
  max-height: 130px;
  overflow: auto;
  border: 1px solid #eeeeee;
  border-top: none 0;
  border-bottom: none 0;
}
</style>
