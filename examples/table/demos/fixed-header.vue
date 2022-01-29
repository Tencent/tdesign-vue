<template>
  <div>
    <div>
      <t-radio-group v-model="tableLayout" variant="default-filled">
        <t-radio-button value="fixed">table-layout: fixed</t-radio-button>
        <t-radio-button value="auto">table-layout: auto</t-radio-button>
      </t-radio-group>
    </div>
    <br /><br />
    <!-- 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。 -->
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :max-height="320"
      :table-layout="tableLayout"
      bordered
    ></t-table>
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
    needed: i % 4 === 0 ? '是' : '否',
    description: '数据源',
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
          width: 120,
          colKey: 'platform',
          title: '平台',
          foot: '公有(5)',
        },
        {
          width: 120,
          colKey: 'type',
          title: '类型',
          foot: 'Number(5)',
        },
        {
          colKey: 'default',
          title: '默认值',
          foot: '[](4)',
        },
        {
          colKey: 'needed',
          title: '必传',
          foot: '否(6)',
        },
        {
          colKey: 'detail.postion',
          title: '详情信息',
          width: 200,
          ellipsis: true,
          foot: '-',
        },
        {
          colKey: 'description',
          title: '说明',
          foot: '数据(10)',
        },
      ],
    };
  },
};
</script>
