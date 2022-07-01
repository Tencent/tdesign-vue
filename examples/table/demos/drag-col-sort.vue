<template>
  <div class="demo-container t-table-demo-sort">
    <div class="item">
      <t-table rowKey="id" :columns="columns" :data="data" dragSort="col" @drag-sort="onDragSort">
        <template #status="{ row }">
          <p class="status" :class="['', 'warning', 'unhealth'][row && row.status]">
            {{ ['健康', '警告', '异常'][row && row.status] }}
          </p>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script>
const initialColumns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
  },
  {
    colKey: 'survivalTime',
    title: '存活时间(s)',
    width: 200,
  },
  { colKey: 'owner', title: '管理员', width: 100 },
];

const initialData = new Array(4).fill(5).map((_, i) => ({
  id: i + 1,
  instance: `JQTest${i + 1}`,
  status: [0, 1, 2, 1][i % 4],
  owner: ['jenny;peter', 'jenny', 'jenny', 'peter'][i % 4],
  survivalTime: [1000, 1000, 500, 1500][i % 4],
}));

export default {
  data() {
    return {
      data: [...initialData],
      columns: [...initialColumns],
    };
  },
  methods: {
    // currentData is going to be deprecated
    onDragSort({
      currentIndex, current, targetIndex, target, data, newData, e, sort,
    }) {
      console.log('重新排序', currentIndex, current, targetIndex, target, data, newData, e, sort);
      if (sort === 'col') {
        this.columns = newData;
      }
    },
  },
};
</script>
