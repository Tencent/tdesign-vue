<template>
  <!-- 注意控制父元素宽度 -->
  <div style="width: 100%" class="tdesign-demo-block-column-large tdesign-demo-table-multi-header">
    <!-- 按钮操作区域 -->
    <div>
      <t-checkbox v-model="bordered">显示表格边框</t-checkbox>
      <t-checkbox v-model="fixedHeader">显示固定表头</t-checkbox>
      <t-checkbox v-model="fixedLeftCol">固定左侧列</t-checkbox>
      <t-checkbox v-model="fixedRightCol">固定右侧列</t-checkbox>
    </div>

    <!-- 多级表头中，如果要使用固定列功能，则必须设置 colKey 和 fixed -->
    <t-table
      row-key="property"
      :data.sync="data"
      :sort.sync="sortInfo"
      :columns="columns"
      :bordered="bordered"
      :max-height="fixedHeader ? 380 : undefined"
      :columnController="{ displayType: 'auto-width' }"
      :filterRow="() => null"
      tableContentWidth="1200"
      table-layout="auto"
      @data-change="onDataChange"
      @filter-change="onFilterChange"
    ></t-table>
  </div>
</template>
<script>
const data = [];
for (let i = 0; i < 6; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    property: ['A', 'B', 'C'][i % 3],
    default: [1, 2, 3, 4, 5, 6][i % 6],
    detail: {
      postion: `读取 ${i} 个数据的嵌套信息值`,
    },
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
    field1: '字段1',
    field2: '字段2',
    field3: '字段3',
    field4: '字段4',
    field5: '字段5',
  });
}

function getColumns(fixedLeftCol, fixedRightCol) {
  return [
    {
      title: '序号',
      colKey: 'index',
      fixed: fixedLeftCol && 'left',
    },
    {
      title: '汇总属性',
      fixed: fixedLeftCol && 'left',
      colKey: 'total_info',
      children: [
        {
          align: 'left',
          colKey: 'platform',
          title: '平台',
          fixed: fixedLeftCol && 'left',
        },
        {
          title: '类型及默认值',
          colKey: 'type_default',
          fixed: fixedLeftCol && 'left',
          children: [
            {
              align: 'left',
              colKey: 'type',
              title: '类型',
              fixed: fixedLeftCol && 'left',
            },
            {
              align: 'left',
              colKey: 'default',
              title: '默认值',
              fixed: fixedLeftCol && 'left',
              sorter: (a, b) => a.default - b.default,
            },
            {
              align: 'left',
              colKey: 'needed',
              title: '是否必传',
              fixed: fixedLeftCol && 'left',
            },
          ],
        },
      ],
    },
    {
      colKey: 'field1',
      title: '字段1',
    },
    {
      colKey: 'field2',
      title: '字段2',
    },

    {
      colKey: 'field3',
      title: '字段3',
    },
    {
      colKey: 'field4',
      title: '字段4',
    },
    {
      colKey: 'field5',
      title: '字段5',
    },
    {
      title: '属性及说明',
      colKey: 'instruction',
      fixed: fixedRightCol && 'right',
      children: [
        {
          align: 'left',
          ellipsis: true,
          colKey: 'property',
          title: '属性',
          fixed: fixedRightCol && 'right',
          filter: {
            type: 'single',
            list: [
              { label: 'any', value: '' },
              { label: 'A', value: 'A' },
              { label: 'B', value: 'B' },
              { label: 'D', value: 'D' },
            ],
          },
        },
        {
          align: 'left',
          ellipsis: true,
          colKey: 'description',
          title: '说明',
          fixed: fixedRightCol && 'right',
        },
      ],
    },
  ];
}

export default {
  data() {
    return {
      sortInfo: {},
      bordered: true,
      fixedHeader: false,
      fixedLeftCol: false,
      fixedRightCol: false,
      data,
    };
  },
  computed: {
    columns() {
      return getColumns(this.fixedLeftCol, this.fixedRightCol);
    },
  },
  methods: {
    onDataChange(a, b) {
      console.log(a, b);
    },
    onFilterChange(filterValue) {
      this.data = data.filter((t) => !filterValue.property || filterValue.property === t.property);
    },
  },
};
</script>
