<template>
  <div class="tdesign-demo-block-column-large">
    <!-- 按钮操作区域 -->
    <!-- 1. 设置哪些列允许自定义显示 :columnController="{ fields: ['platform', 'type', 'default']}" -->
    <!-- 2. defaultDisplayColumns = ['platform'] 设置默认显示哪些列，仅第一次有效 -->
    <!-- 3. displayColumns 动态设置显示哪些列，受控属性，支持 displayColumns.sync 语法糖 -->
    <!-- 4. onDisplayColumnsChange 当前显示列发生变化时触发 -->
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :columnController="{ displayType: 'fixed-width', fields: ['platform', 'type', 'default'] }"
      tableLayout="auto"
      stripe
      bordered
      @column-change="onColumnChange"
    ></t-table>
  </div>
</template>
<script lang="jsx">
const data = [];
for (let i = 0; i < 5; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}
export default {
  data() {
    return {
      data,
      displayColumns: ['platform'],
      columns: [
        {
          align: 'center',
          className: 'row',
          colKey: 'index',
          title: '序号',
        },
        {
          colKey: 'platform',
          title: '平台',
        },
        {
          colKey: 'type',
          title: '类型',
        },
        {
          colKey: 'default',
          title: '默认值',
        },
        {
          colKey: 'needed',
          title: '是否必传',
        },
        {
          colKey: 'detail.position',
          title: '详情信息',
          ellipsis: true,
        },
      ],
    };
  },

  methods: {
    onColumnChange(params) {
      console.log(params);
    },
  },
};
</script>
