<template>
  <div class="tdesign-demo-block-column-large">
    <div>
      <label>禁用单元格右键菜单：</label>
      <t-switch v-model="preventCellContextmenu"></t-switch>
    </div>
    <t-calendar
      :value="value"
      :preventCellContextmenu="preventCellContextmenu"
      @cell-click="cellClick"
      @cell-double-click="cellDoubleClick"
      @cell-right-click="cellRightClick"
      @controller-change="controllerChange"
    ></t-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      preventCellContextmenu: false,
      value: null,
      options: [
        { value: true, label: '禁用' },
        { value: false, label: '不禁用' },
      ],
    };
  },
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
