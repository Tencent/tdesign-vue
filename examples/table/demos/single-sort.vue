<template>
  <div class="tdesign-demo-block-column-large demo-container">
    <div>
      <t-checkbox v-model="hideSortTips"> 隐藏排序文本提示 </t-checkbox>
      <span style="padding-left: 16px; vertical-align: top">排序：{{ sort }}</span>
    </div>

    <!-- 非受控用法：不需要传 sort，或者只需要传 defaultSort: { sortBy: 'status', descending: true }），defaultSort 仅第一次有效 -->
    <!-- 非受控用法，示例代码有效，勿删 -->
    <!-- <t-table rowKey="id" :columns="columns" :data="data" @sort-change="defaultSortChange">
      <template #status="{ row }">
        <p v-if="row.status === 0" class="status">健康</p>
        <p v-if="row.status === 1" class="status warning">警告</p>
        <p v-if="row.status === 2" class="status unhealth">异常</p>
      </template>
    </t-table> -->

    <!-- 受控用法，示例代码有效，勿删 -->
    <t-table
      rowKey="id"
      :columns="columns"
      :data="data"
      :sort="sort"
      :hideSortTips="hideSortTips"
      bordered
      @sort-change="sortChange"
      @change="onChange"
    >
      <template #status="{ row }">
        <p v-if="row.status === 0" class="status">健康</p>
        <p v-if="row.status === 1" class="status warning">警告</p>
        <p v-if="row.status === 2" class="status unhealth">异常</p>
      </template>
    </t-table>
  </div>
</template>

<script>
const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
    sorter: true,
  },
  {
    colKey: 'survivalTime',
    title: '存活时间(s)',
    width: 200,
    sortType: 'all',
    sorter: true,
  },
  { colKey: 'owner', title: '管理员', width: 100 },
];
const data = new Array(4).fill(null).map((_, i) => ({
  id: i + 1,
  instance: `JQTest${i + 1}`,
  status: [0, 1, 2, 1][i % 3],
  owner: ['jenny;peter', 'jenny', 'peter'][i % 3],
  survivalTime: [1000, 1000, 500, 1500][i % 3],
}));

export default {
  data() {
    return {
      data,
      columns,
      hideSortTips: false,
      sort: {
        // 按照 status 字段进行排序
        sortBy: 'status',
        // 是否按照降序进行排序
        descending: true,
      },
    };
  },
  methods: {
    sortChange(sort) {
      // 对于受控属性而言，这里的赋值很重要，不可缺少
      this.sort = sort;
      this.request(sort);
      console.log('sort-change', sort);
    },
    // 排序、分页、过滤等发生变化时会出发 change 事件
    onChange(info, context) {
      console.log('change', info, context);
    },
    // 非受控用法，不需要传递 sort 给 Table 组件，因而此处无需执行 this.sort = sort 进行赋值
    defaultSortChange(sort) {
      this.request(sort);
    },
    request(sort) {
      // 模拟异步请求，进行数据排序
      const timer = setTimeout(() => {
        if (sort) {
          this.data = data
            .concat()
            .sort((a, b) => (sort.descending ? b[sort.sortBy] - a[sort.sortBy] : a[sort.sortBy] - b[sort.sortBy]));
        } else {
          this.data = data.concat();
        }
        clearTimeout(timer);
      }, 100);
    },
  },
};
</script>
<style lang="less">
/deep/ [class*='t-table-expandable-icon-cell'] .t-icon {
  background-color: transparent;
}
.demo-container {
  .title {
    font-size: 14px;
    line-height: 28px;
    display: block;
    margin: 10px 0;
    i {
      font-style: normal;
    }
  }
  .status {
    position: relative;
    color: #00a870;
    margin-left: 10px;
    &::before {
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      content: '';
      background-color: #00a870;
      width: 6px;
      height: 6px;
      margin-left: -10px;
      border-radius: 50%;
    }
  }
  .status.unhealth {
    color: #e34d59;
    &::before {
      background-color: #e34d59;
    }
  }
  .status.warning {
    color: #ed7b2f;
    &::before {
      background-color: #ed7b2f;
    }
  }
}
</style>
