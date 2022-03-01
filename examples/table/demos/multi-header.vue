<template>
  <div class="tdesign-demo-block-column-large tdesign-demo-table-multi-header">
    <!-- 按钮操作区域 -->
    <div>
      <!-- <t-checkbox v-model="stripe">显示斑马纹</t-checkbox> -->
      <t-checkbox v-model="bordered">显示表格边框</t-checkbox>
      <t-checkbox v-model="fixedHeader">显示固定表头</t-checkbox>
      <!-- <t-checkbox v-model="hover">显示悬浮效果</t-checkbox> -->
      <!-- <t-checkbox v-model="tableLayout">宽度自适应</t-checkbox> -->
    </div>

    <t-table
      row-key="property"
      :data.sync="data"
      :sort.sync="sortInfo"
      :columns="columns"
      :bordered="bordered"
      :max-height="fixedHeader ? 300 : undefined"
      :columnController="{ displayType: 'fixed-width' }"
      :filterRow="() => null"
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
  });
}

export default {
  data() {
    return {
      sortInfo: {},
      bordered: true,
      fixedHeader: false,
      data,
      columns: [
        {
          title: '序号',
          colKey: 'index',
        },
        {
          title: '汇总属性',
          children: [
            {
              align: 'left',
              colKey: 'platform',
              title: '平台',
            },
            {
              title: '类型及默认值',
              children: [
                {
                  align: 'left',
                  colKey: 'type',
                  title: '类型',
                },
                {
                  align: 'left',
                  colKey: 'default',
                  title: '默认值',
                  sorter: (a, b) => a.default - b.default,
                },
                {
                  align: 'left',
                  colKey: 'needed',
                  title: '是否必传',
                },
              ],
            },
          ],
        },
        {
          title: '属性及说明',
          children: [
            {
              align: 'left',
              ellipsis: true,
              colKey: 'property',
              title: '属性',
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
            },
          ],
        },
      ],
    };
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
