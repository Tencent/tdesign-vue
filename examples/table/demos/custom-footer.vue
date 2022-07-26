<template>
  <div class="tdesign-demo-block-column-large">
    <div>
      <t-radio-group v-model="footerType" variant="default-filled">
        <t-radio-button value="normal">普通表尾</t-radio-button>
        <t-radio-button value="full">通栏表尾</t-radio-button>
      </t-radio-group>
    </div>
    <!-- rowClassName="tdesign-demo__row-custom-name" -->
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :foot-data="footerType === 'normal' ? footData : []"
      :rowClassName="rowClassName"
    >
      <template #footer-summary>
        <div class="t-table__row-filter-inner" v-if="footerType === 'full'">通栏总结行信息</div>
      </template>
      <template #t-foot-required> <b>必传(插槽)</b> </template>
    </t-table>
  </div>
</template>
<script lang="jsx">
const data = [];
for (let i = 0; i < 3; i++) {
  data.push({
    index: i,
    platform: i % 2 === 0 ? '共有' : '私有',
    type: ['String', 'Number', 'Array', 'Object'][i % 4],
    default: ['-', '0', '[]', '{}'][i % 4],
    detail: {
      position: `读取 ${i} 个数据的嵌套信息值`,
    },
    required: i % 4 === 0 ? '是' : '否',
    description: '数据源',
  });
}
export default {
  data() {
    return {
      data,
      footerType: 'normal',
      // 表尾有一行数据
      footData: [{
        index: '123', type: '全部类型', default: '', description: '-',
      }],
      columns: [
        {
          align: 'center',
          width: '100',
          className: 'row',
          colKey: 'index',
          title: '序号',
          foot: () => <b style="color: rgb(0, 82, 217)">表尾</b>,
        },
        {
          width: 100,
          colKey: 'platform',
          title: '平台',
          foot: (h, { rowIndex }) => <span>第 {rowIndex + 1} 行</span>,
        },
        {
          colKey: 'type',
          title: '类型',
        },
        {
          colKey: 'default',
          title: '默认值',
          foot: (h, { row }) => <span>{row.default || '空'}</span>,
        },
        {
          colKey: 'required',
          title: '是否必传',
          width: 150,
          // 使用插槽渲染，插槽名称为 't-foot-required'
          foot: 't-foot-required',
        },
        {
          colKey: 'detail.position',
          title: '详情信息',
          width: 200,
          ellipsis: true,
          foot: () => <div>渲染函数输出表尾信息</div>,
        },
      ],
    };
  },

  methods: {
    // type 可选值：foot 和 body
    rowClassName({ type }) {
      if (type === 'foot') return 't-tdesign__custom-footer-tr';
      return 't-tdesign__custom-body-tr';
    },
  },
};
</script>
