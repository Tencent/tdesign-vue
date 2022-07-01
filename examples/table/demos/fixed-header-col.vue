<template>
  <!-- 父元素宽度不能超过 100% -->
  <div class="tdesign-demo-block-column" style="width: 100%">
    <div>
      <t-radio-group v-model="tableLayout" variant="default-filled">
        <t-radio-button value="fixed">table-layout: fixed</t-radio-button>
        <t-radio-button value="auto">table-layout: auto</t-radio-button>
      </t-radio-group>
    </div>

    <div>
      <t-checkbox v-model="fixedTopAndBottomRows">是否冻结首尾两行</t-checkbox>
      <t-checkbox v-model="stripe">是否显示斑马纹</t-checkbox>
      <!-- TODO：虚拟滚动开启与关闭支持动态响应 -->
      <!-- <t-checkbox v-model="virtualScroll">开启虚拟滚动</t-checkbox> -->
    </div>

    <!-- 如果希望表格列宽自适应，设置 `table-layout: auto` 即可。需同时设置 table-content-width -->
    <!-- fixedRows: [2, 2] 表示冻结表格的头两行和尾两行 -->
    <!-- footData 可以是多行，均支持固定在底部 -->
    <t-table
      rowKey="index"
      :data="data"
      :footData="[{}]"
      :columns="columns"
      :table-layout="tableLayout"
      :table-content-width="tableLayout === 'fixed' ? undefined : '1600px'"
      :max-height="fixedTopAndBottomRows ? 500 : 300"
      :fixedRows="fixedTopAndBottomRows ? [2, 2] : undefined"
      :scroll="virtualScroll ? { type: 'virtual' } : undefined"
      :stripe="stripe"
      bordered
      resizable
    >
      <template #operation="slotProps">
        <a class="link" @click="rehandleClickOp(slotProps)">删除</a>
      </template>
    </t-table>
  </div>
</template>
<script>
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
        position1: `读取 ${i} 个数据的嵌套信息值`,
      },
      description: '数据源',
      needed: i % 4 === 0 ? '是' : '否',
    });
  }
  return data;
}

export default {
  data() {
    return {
      virtualScroll: false,
      fixedTopAndBottomRows: false,
      stripe: false,
      tableLayout: 'fixed',
      data: getData(14),
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
          foot: '-',
        },
        {
          colKey: 'detail.position',
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
  watch: {
    virtualScroll(val) {
      this.data = val ? getData(2000) : getData(15);
    },
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
