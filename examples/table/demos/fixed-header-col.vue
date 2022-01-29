<template>
  <!-- 父元素宽度不能超过 100% -->
  <div class="tdesign-demo-block-column" style="width: 100%">
    <div>
      <t-radio-group v-model="tableLayout" variant="default-filled">
        <t-radio-button value="fixed">table-layout: fixed</t-radio-button>
        <t-radio-button value="auto">table-layout: auto</t-radio-button>
      </t-radio-group>
    </div>

    <!-- 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。 -->
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :table-layout="tableLayout"
      :table-content-width="tableLayout === 'fixed' ? undefined : '1600px'"
      height="300"
      bordered
    >
      <template #operation="slotProps">
        <a class="link" @click="rehandleClickOp(slotProps)">删除</a>
      </template>
    </t-table>
  </div>
</template>
<script>
import TTable from '../../../src/table/base-table';

const data = [];
for (let i = 0; i < 20; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      postion: `读取 ${i} 个数据的嵌套信息值`,
    },
    description: '数据源',
    needed: i % 4 === 0 ? '是' : '否',
  });
}
export default {
  components: { TTable },
  data() {
    return {
      tableLayout: 'fixed',
      data,
      columns: [
        {
          align: 'center',
          width: 100,
          colKey: 'index',
          title: '序号',
          fixed: 'left',
          foot: '总述',
        },
        {
          colKey: 'platform',
          title: '平台',
          width: 120,
          foot: '公有(5)',
        },
        {
          colKey: 'type',
          title: '类型',
          width: 120,
          foot: 'Number(5)',
        },
        {
          colKey: 'default',
          title: '默认值',
          width: 150,
          foot: '[](4)',
        },
        {
          colKey: 'detail.postion',
          title: '详情信息',
          width: 250,
          foot: '-',
        },
        {
          colKey: 'description',
          title: '说明',
          width: 120,
          foot: '数据(10)',
        },
        {
          colKey: 'needed',
          title: '必传',
          foot: '否(6)',
          width: 120,
        },
        {
          colKey: 'operation',
          title: '操作',
          width: 100,
          cell: 'operation',
          fixed: 'right',
        },
      ],
    };
  },
  methods: {
    rehandleClickOp({ text, row }) {
      console.log(text, row);
    },
  },
};
</script>

<style lang="less" scoped>
.link {
  cursor: pointer;
}
</style>
