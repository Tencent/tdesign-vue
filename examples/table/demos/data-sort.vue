<template>
  <div class="demo-container t-table-demo-sort">
    <!-- t-locale-provider 一般用于全局配置某个组件的特性，此代码示例 示范了如何对表格排序图标进行统一配置 -->
    <t-config-provider :globalConfig="globalLocale">
      <div class="item">
        <div style="margin: 16px">
          <t-checkbox v-model="allowMultipleSort">是否允许多字段排序</t-checkbox>
        </div>
        <div style="margin: 16px">排序：{{ JSON.stringify(sort) || '暂无' }}</div>

        <!-- 本地数据排序涉及到 data 的变更，相对比较慎重，因此仅支持受控用法 -->
        <!-- 1. 支持语法糖：sort.sync，效果同 :sort="sort" + onSortChange。2. 支持非受控属性 defaultSort -->
        <!-- 2. 支持语法糖：data.sync，效果同 :data="data" + onDataChange -->
        <!-- 语法糖用法示例代码，有效勿删 -->
        <!-- <t-table
          rowKey="id"
          :columns="columns"
          :data.sync="data"
          :sort.sync="sort"
        > -->

        <t-table
          rowKey="id"
          :columns="columns"
          :data="data"
          :sort="sort"
          @sort-change="sortChange"
          @data-change="dataChange"
          :multipleSort="allowMultipleSort"
        >
          <icon slot="op-column" name="descending-order" />
          <template #status="{ row }">
            <p class="status" :class="['', 'warning', 'unhealth'][row.status]">
              {{ ['健康', '警告', '异常'][row.status] }}
            </p>
          </template>
        </t-table>
      </div>
    </t-config-provider>
  </div>
</template>

<script lang="jsx">
import { CaretDownSmallIcon, Icon } from 'tdesign-icons-vue';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status',
    title: '状态',
    width: 100,
    sortType: 'all',
    sorter: (a, b) => a.status - b.status,
  },
  {
    colKey: 'survivalTime',
    title: '存活时间(s)',
    width: 200,
    sortType: 'all',
    sorter: (a, b) => a.survivalTime - b.survivalTime,
  },
  { colKey: 'owner', title: '管理员', width: 100 },
];

// 本地数据排序，表示组件内部会对参数 data 进行数据排序。如果 data 数据为 10 条，就仅对这 10 条数据进行排序。
const data = new Array(4).fill(null).map((_, i) => ({
  id: i + 1,
  instance: `JQTest${i + 1}`,
  status: [0, 1, 2, 1][i % 3],
  owner: ['jenny;peter', 'jenny', 'peter'][i % 3],
  survivalTime: [1000, 1000, 500, 1500][i % 3],
}));

export default {
  components: {
    Icon,
  },
  data() {
    return {
      data,
      columns,
      sort: {},
      singleSort: {
        sortBy: 'status',
        descending: true,
      },
      multipleSorts: [
        {
          sortBy: 'status',
          descending: true,
        },
      ],
      allowMultipleSort: false,
      globalLocale: {
        table: {
          sortIcon: (h) => h && <CaretDownSmallIcon size="16px" />,
        },
      },
    };
  },
  watch: {
    allowMultipleSort: {
      immediate: true,
      handler(val) {
        this.sort = val ? this.multipleSorts : this.singleSort;
      },
    },
  },
  methods: {
    // 除了监听 sortChange 事件调整排序，也可以监听 change 事件
    sortChange(sort, options) {
      console.log('sort-change', sort, options);
      // 受控操作当中，this.sort 和 this.data 的赋值都是必须
      this.sort = sort;
      this.data = options.currentDataSource;
    },
    dataChange(data) {
      // 除了 sortChange，也可以在这里对 data.value 进行赋值
      // this.data = data;
      console.log('data-change', data);
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
