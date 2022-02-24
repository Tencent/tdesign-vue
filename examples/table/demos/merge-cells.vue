<template>
  <t-table
    :bordered="true"
    :data="data"
    :columns="columns"
    :rowKey="rowKey"
    :size="size"
    :rowspanAndColspan="rowspanAndColspan"
  >
  </t-table>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          platform: '公有',
          type: 'Array<any>',
          default: '[]',
          needed: 'Y',
          description: '数据源',
        },
        {
          platform: '私有',
          type: 'String/""',
          default: '""',
          needed: 'Y',
          description: '描述',
        },
        {
          platform: '私有',
          type: 'Object / {}',
          default: '{}',
          needed: 'Y',
          description: '复杂类型',
        },
        {
          platform: '公有',
          type: 'Boolean',
          default: 'false',
          needed: 'N',
          description: '标识符',
        },
        {
          platform: '公有',
          type: 'Number',
          default: '-1 / N',
          needed: 'Y',
          description: '位置',
        },
        {
          platform: '私有',
          type: 'Number',
          default: '-1',
          needed: 'N',
          description: 'Number 类型',
        },
      ],
      columns: [
        {
          align: 'left',
          width: '100',
          colKey: 'platform',
          title: '平台',
        },
        {
          align: 'left',
          width: '100',
          colKey: 'type',
          title: '类型',
        },
        {
          align: 'left',
          width: '100',
          colKey: 'default',
          title: '默认值',
        },
        {
          align: 'left',
          width: '100',
          colKey: 'needed',
          title: '是否必传',
        },
        {
          align: 'left',
          width: '100',
          colKey: 'description',
          title: '说明',
        },
      ],
      rowKey: 'default',
      size: 'small',
    };
  },
  methods: {
    rowspanAndColspan({ col, rowIndex }) {
      if (col.colKey === 'needed' && rowIndex === 0) {
        return {
          colspan: 2,
        };
      }
      if (col.colKey === 'type' && rowIndex === 1) {
        return {
          colspan: 2,
          rowspan: 2,
        };
      }
      if (col.colKey === 'default' && rowIndex === 4) {
        return {
          colspan: 2,
          rowspan: 2,
        };
      }
    },
  },
};
</script>
