<template>
  <div class="demo-container">
    <div class="item">
      <!-- 为保证组件收益最大化，当数据量小于 `scroll.threshold` 时，无论虚拟滚动的配置是否存在，组件内部都不会开启虚拟滚动，默认值为 100 -->
      <t-table
        row-key="id"
        :columns="columns"
        :data="data"
        :scroll="{ type: 'virtual', rowHeight: 48, bufferSize: 30 }"
        :height="300"
      >
      </t-table>
    </div>
  </div>
</template>

<script lang="jsx">
const columns = [
  {
    colKey: 'id',
    title: 'id',
  },
  {
    colKey: 'instance',
    title: '集群名称',
  },
  {
    colKey: 'survivalTime',
    title: '存活时间(s)',
  },
  { colKey: 'owner', title: '管理员' },
];

const initData = [
  {
    id: 1,
    instance: '当前行高度2行,当前行高度2行,当前行高度2行,当前行高度2行',
    status: 0,
    owner: 'jenny;peter',
    survivalTime: 1000,
  },
  {
    id: 2,
    instance: '当前行高度2行,当前行高度2行,当前行高度2行,当前行高度2行',
    status: 1,
    owner: 'jenny',
    survivalTime: 1000,
  },
  {
    id: 3,
    instance: 'JQTest',
    status: 2,
    owner: 'jenny',
    survivalTime: 500,
  },
  {
    id: 4,
    instance: 'JQTest',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },
  {
    id: 5,
    instance: 'JQTest',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },
  {
    id: 6,
    instance: 'JQTest',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },

  {
    id: 7,
    instance: 'JQTest',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },
  {
    id: 8,
    instance: 'JQTest',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },
  {
    id: 9,
    instance: 'JQTest',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },
  {
    id: 10,
    instance: 'JQTest',
    status: 1,
    owner: 'peter;peter;peter;peter;peter;peter;peter;peter;peter;peter;peter;peter;peter;peter;',
    survivalTime: 1500,
  },
];

// 为了使得表格滚动更加平稳，建议指定row-height参数值为接近表格的平均行高
const times = Array.from(new Array(600), () => ''); // 测试共计1k条数据
const testData = [];
times.forEach((item, i) => {
  const k = i % 10;
  testData[i] = { ...initData[k], id: i + 1 };
});

export default {
  name: 'VirtualScroll',
  data() {
    return {
      data: [...testData],
      columns,
    };
  },
};
</script>
