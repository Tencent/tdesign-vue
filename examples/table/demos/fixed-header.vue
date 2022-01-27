<template>
  <div>
    <div>
      <t-radio-group v-model="tableLayout" variant="default-filled">
        <t-radio-button value="fixed">table-layout: fixed</t-radio-button>
        <t-radio-button value="auto">table-layout: auto</t-radio-button>
      </t-radio-group>
    </div>
    <br /><br />
    <t-table rowKey="index" :data="data" :columns="columns" :height="200" :table-layout="tableLayout"></t-table>
  </div>
</template>
<script>
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
  data() {
    return {
      tableLayout: 'fixed',
      data,
      columns: [
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
          title: '必传',
        },
        {
          colKey: 'detail.postion',
          title: '详情信息',
          width: 200,
          ellipsis: true,
        },
        {
          colKey: 'description',
          title: '说明',
        },
      ],
    };
  },
};
</script>
