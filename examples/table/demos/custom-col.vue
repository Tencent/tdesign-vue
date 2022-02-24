<template>
  <div class="tdesign-demo-block-column-large">
    <!-- 按钮操作区域 -->
    <!-- 设置哪些列允许自定义显示 :columnController="{ fields: ['platform', 'type', 'default']}" -->
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :stripe="stripe"
      :bordered="bordered"
      :hover="hover"
      :columnController="{ displayType: 'auto-width' }"
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
      postion: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}
export default {
  data() {
    return {
      data,
      stripe: true,
      bordered: true,
      hover: false,
      columns: [
        {
          align: 'center',
          width: '100',
          className: 'row',
          colKey: 'index',
          title: '序号',
        },
        {
          width: 100,
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
          colKey: 'detail.postion',
          title: '详情信息',
          width: 200,
          ellipsis: true,
        },
      ],
      /** 非受控用法：与分页组件对齐 */
      pagination: {
        defaultCurrent: 2,
        defaultPageSize: 10,
        total: 120,
      },
    };
  },
};
</script>
