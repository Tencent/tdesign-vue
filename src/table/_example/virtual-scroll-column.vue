<template>
  <t-table
    ref="tableRef"
    data-demo-ready
    row-key="id"
    :columns="columns"
    :data="data"
    :scroll="{ type: 'virtual' }"
    table-layout="fixed"
    :height="400"
    bordered
  >
  </t-table>
</template>

<script lang="jsx">
const COLUMN_COUNT = 60;
const ROW_COUNT = 50;

const columns = [];
for (let c = 0; c < COLUMN_COUNT; c++) {
  columns.push({
    colKey: `col${c}`,
    title: `列${c}`,
    width: 120,
    fixed: c === 0 ? 'left' : undefined,
  });
}

const data = [];
for (let r = 0; r < ROW_COUNT; r++) {
  const row = { id: r };
  for (let c = 0; c < COLUMN_COUNT; c++) {
    row[`col${c}`] = `r${r}c${c}`;
  }
  data.push(row);
}

export default {
  name: 'VirtualScrollColumn',
  data() {
    return {
      tableRef: null,
      columns,
      data,
    };
  },
};
</script>
