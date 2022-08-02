<template>
  <!-- 注意组件父元素的宽度 -->
  <div class="tdesign-demo-block-column-large tdesign-demo__table-affix" style="width: 100%">
    <div>
      <t-checkbox v-model="headerAffixedTop">表头吸顶</t-checkbox>
      <t-checkbox v-model="footerAffixedBottom" style="margin-left: 32px">表尾吸底</t-checkbox>
      <t-checkbox v-model="horizontalScrollAffixedBottom" style="margin-left: 32px">滚动条吸底</t-checkbox>
      <t-checkbox v-model="paginationAffixedBottom" style="margin-left: 32px">分页器吸底</t-checkbox>
      <t-checkbox v-model="fixedLeftColumn" style="margin-left: 32px">固定左侧列</t-checkbox>
      <t-checkbox v-model="fixedRightColumn" style="margin-left: 32px">固定右侧列</t-checkbox>
    </div>
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :footData="footData"
      :rowClassName="rowClassName"
      :pagination="{ defaultCurrent: 1, defaultPageSize: 5, total: TOTAL }"
      :headerAffixedTop="{ offsetTop: 87, zIndex: 1000 }"
      :footerAffixedBottom="
        footerAffixedBottom ? { offsetBottom: paginationAffixedBottom ? 60 : 0, zIndex: 1000 } : false
      "
      :horizontalScrollAffixedBottom="
        horizontalScrollAffixedBottom ? { offsetBottom: paginationAffixedBottom ? 61 : 0, zIndex: 1000 } : false
      "
      :paginationAffixedBottom="paginationAffixedBottom"
      table-ayout="fixed"
      dragSort="col"
      bordered
      resizable
      @drag-sort="onDragSortChange"
    >
      <template #t-foot-required> 插槽渲染表尾 </template>
    </t-table>
  </div>
</template>
<script lang="jsx">
function getData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
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
      expo: 235245,
      click: 1653,
      ctr: '12%',
    });
  }
  return data;
}

const TOTAL = 38;

function getColumns(h, { fixedLeftColumn, fixedRightColumn }) {
  return [
    {
      align: 'center',
      className: 'row',
      colKey: 'index',
      title: '序号',
      foot: () => <b style="color: rgb(0, 82, 217)">表尾</b>,
      fixed: fixedLeftColumn ? 'left' : undefined,
    },
    {
      colKey: 'platform',
      title: '平台',
      foot: (h, { rowIndex }) => <span>第 {rowIndex + 1} 行</span>,
    },
    {
      colKey: 'type',
      title: '类型',
    },
    {
      colKey: 'expo',
      title: '曝光',
      foot: '-',
    },
    {
      colKey: 'click',
      title: '点击',
      foot: '-',
    },
    {
      colKey: 'ctr',
      title: '点击率',
      foot: '-',
    },
    {
      colKey: 'default',
      title: '默认值',
      foot: (h, { row }) => <span>{row.default || '空'}</span>,
    },
    {
      colKey: 'required',
      title: '是否必传',
      // 使用插槽渲染，插槽名称为 't-foot-required'
      foot: 't-foot-required',
    },
    {
      colKey: 'detail.position',
      title: '详情信息',
      ellipsis: true,
      foot: () => <div>渲染函数输出表尾信息</div>,
    },
    {
      colKey: 'operation',
      title: '操作',
      cell: () => '查看',
      width: 80,
      foot: '-',
      fixed: fixedRightColumn ? 'right' : undefined,
    },
  ];
}

export default {
  data() {
    return {
      data: getData(TOTAL),
      TOTAL,
      // 重要：如果在预渲染场景下，初次渲染的表格宽度和最终呈现宽度不一样，请异步设置表头吸顶
      headerAffixedTop: true,
      footerAffixedBottom: true,
      fixedLeftColumn: true,
      fixedRightColumn: true,
      horizontalScrollAffixedBottom: false,
      paginationAffixedBottom: false,
      // 表尾有一行数据
      footData: [{ index: 'footer-row-1', type: '全部类型', description: '-' }],
      columns: [],
    };
  },

  watch: {
    // 底部滚动条 和 Footer 无需同时出现，二选一即可
    horizontalScrollAffixedBottom(val) {
      val && (this.footerAffixedBottom = false);
    },
    // 底部滚动条 和 Footer 无需同时出现，二选一即可
    footerAffixedBottom(val) {
      val && (this.horizontalScrollAffixedBottom = false);
    },
    // 左侧固定列发生变化时
    fixedLeftColumn: {
      handler(val) {
        this.columns = getColumns(this.$createElement, {
          fixedLeftColumn: val,
          fixedRightColumn: this.fixedRightColumn,
        });
      },
      immediate: true,
    },
    // 右侧固定列发生变化时
    fixedRightColumn(val) {
      this.columns = getColumns(this.$createElement, {
        fixedLeftColumn: this.fixedLeftColumn,
        fixedRightColumn: val,
      });
    },
  },

  methods: {
    // type 可选值：foot 和 body
    rowClassName({ type }) {
      if (type === 'foot') return 't-tdesign__custom-footer-tr';
      return 't-tdesign__custom-body-tr';
    },
    onDragSortChange({ newData }) {
      this.columns = newData;
    },
  },
};
</script>

<style>
/*
 * table-layout: auto 模式下，table 元素的宽度设置很重要很重要。
 * 如果不设置，列多了之后会挤在一起
 * **/
.tdesign-demo__table-affix table {
  width: 1200px;
}

.tdesign-demo__table-affix .t-table {
  max-width: 800px;
}
</style>
