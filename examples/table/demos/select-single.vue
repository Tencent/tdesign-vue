<template>
  <div>
    <div>
      <t-checkbox v-model="highlightSelectedRow">高亮行选中</t-checkbox>
      <t-checkbox v-model="selectedOnRowClick">整行选中</t-checkbox>
    </div>

    <!-- 支持非受控属性 default-selected-row-keys -->
    <!-- 支持语法糖 selected-row-keys.sync -->
    <t-table
      rowKey="id"
      :columns="columns"
      :data="data"
      :selected-row-keys="selectedRowKeys"
      :class="highlightSelectedRow ? 'tdesign-demo__select-single' : ''"
      @select-change="rehandleSelectChange"
      @row-click="onRowClick"
    >
      <template #status="{ row }">
        <p v-if="row.status === 0" class="status">健康</p>
        <p v-if="row.status === 1" class="status unhealth">异常</p>
      </template>
      <template #op-column><p>操作</p></template>
      <template #op="slotProps">
        <a class="link" @click="rehandleClickOp(slotProps)">管理</a>
        <a class="link" @click="rehandleClickOp(slotProps)">删除</a>
      </template>
    </t-table>
  </div>
</template>

<script>
const data = new Array(5).fill(null).map((item, index) => ({
  id: index + 100,
  instance: `JQTest${index + 1}`,
  status: index % 2,
  owner: 'jenny;peter',
  description: 'test',
}));

const disabledFunc = ({ rowIndex }) => rowIndex === 1 || rowIndex === 3;

export default {
  data() {
    return {
      highlightSelectedRow: false,
      selectedOnRowClick: false,
      selectedRowKeys: [102],
      columns: [
        {
          colKey: 'row-select',
          type: 'single',
          className: 'demo-single-select-cell',
          // 允许单选(Radio)取消行选中
          checkProps: { allowUncheck: true },

          // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删，随时需要测试）。disabled 参数：{row: RowData; rowIndex: number })
          // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
          disabled: disabledFunc,

          // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删，随时需要测试）
          // 这种方式禁用行选中，行文本不会变灰
          // checkProps: ({ rowIndex }) => ({ disabled: rowIndex % 2 !== 0 }),
          width: 64,
        },
        { colKey: 'instance', title: '集群名称', width: 150 },
        {
          colKey: 'status',
          title: '状态',
          width: 100,
          cell: 'status',
        },
        { colKey: 'owner', title: '管理员' },
        { colKey: 'description', title: '描述' },
        {
          colKey: 'op',
          width: 200,
          title: 'op-column',
          cell: 'op',
        },
      ],
      data,
    };
  },
  methods: {
    rehandleClickOp({ text, row }) {
      console.log(text, row);
    },

    rehandleSelectChange(value, { selectedRowData }) {
      this.selectedRowKeys = value;
      console.log(value, selectedRowData);
    },

    // 整行选中示例
    onRowClick({ row, index }) {
      if (this.selectedOnRowClick && !disabledFunc({ row, rowIndex: index })) {
        this.selectedRowKeys = [row.id];
      }
    },
  },
};
</script>

<style lang="less">
/** 此处示范 如何设置行高亮 */
.tdesign-demo__select-single {
  /** 背景色示范 */
  .t-table__row--selected {
    background-color: #ecf2fe;
  }
  /** 最右侧选中图标示范 */
  .t-table__row--selected > td:last-child::after {
    content: '✅';
    font-size: 12px;
    position: absolute;
    right: 0;
    bottom: 0;
    width: 60px;
    height: 35px;
  }
}
</style>

<style lang="less" scoped>
.link {
  cursor: pointer;
  margin-right: 15px;
}
.status {
  position: relative;
  color: #00a870;
  margin-left: 10px;
  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    content: '';
    background-color: #00a870;
    width: 6px;
    height: 6px;
    margin-left: -10px;
    border-radius: 50%;
  }
}
.status.unhealth {
  color: #e34d59;
  &::before {
    background-color: #e34d59;
  }
}
</style>
