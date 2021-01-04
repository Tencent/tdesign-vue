<template>
  <t-table
    :data="data"
    :columns="columns"
    :rowKey="rowKey"
    :bordered="true"
    :hover="hover"
    :stripe="stripe"
    :size="size">
  </t-table>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          platform: '公有，代表这个数据可以是被公开的',
          property: 'data',
          type: 'any[]',
          default: '[]',
          needed: 'Y',
          description: '数据源',
        },
        {
          platform: '公有',
          property: 'rowkey',
          type: 'String',
          default: '-1',
          needed: 'Y',
          description: '指定rowkey',
        },
      ],
      columns: [
        {
          fixed: 'left',
          align: 'left',
          width: '150',
          minWidth: '150',
          className: 'row',
          ellipsis: true,
          colKey: 'type',
          title: '类型',
        },
        {
          fixed: 'left',
          align: 'left',
          width: '150',
          minWidth: '150',
          className: 'test',
          ellipsis: true,
          colKey: 'platform',
          title: '平台',
        },
        {
          align: 'left',
          width: '200',
          minWidth: '200',
          className: 'test2',
          ellipsis: true,
          colKey: 'property',
          title: '属性',
        },
        {
          align: 'left',
          width: '200',
          minWidth: '200',
          className: 'test4',
          ellipsis: true,
          colKey: 'default',
          title: '默认值',
        },
        {
          align: 'left',
          width: '200',
          minWidth: '200',
          className: 'test3',
          ellipsis: true,
          colKey: 'needed',
          title: '是否必传',
        },
        {
          align: 'left',
          fixed: 'right',
          width: '200',
          minWidth: '200',
          className: 'row',
          ellipsis: true,
          colKey: 'description',
          title: '说明',
        },
      ],
      rowKey: 'property',
      size: 'small',
      hover: true,
      stripe: true,
    };
  },
};
</script>
