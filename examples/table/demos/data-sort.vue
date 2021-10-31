<template>
  <div class="demo-container t-table-demo-sort">
    <!-- t-locale-provider 一般用于全局配置某个组件的特性，此代码示例 示范了如何对表格排序图标进行统一配置 -->
    <t-locale-provider :globalLocale="globalLocale">
      <div class="item">
        <div style="margin: 16px">
          <t-checkbox v-model="allowMultipleSort">是否允许多字段排序</t-checkbox>
        </div>

        <!-- 本地数据排序涉及到 data 的变更，相对比较慎重，因此仅支持受控用法 -->
        <div style="margin: 16px">
          <span> 排序方式：{{ JSON.stringify(sort) }} </span>
        </div>
        <t-table
          rowKey="id"
          :columns="columns"
          :data="data"
          :sort="sort"
          @sort-change="sortChange"
          @data-change="dataChange"
          :multipleSort="allowMultipleSort"
        >
          <icon slot='op-column' name="descending-order"/>
          <template #status="{ row }">
            <p class="status" :class="['', 'warning', 'unhealth'][row.status]">
              {{ ['健康', '警告', '异常'][row.status] }}
            </p>
          </template>
        </t-table>
      </div>
    </t-locale-provider>
  </div>
</template>

<script>
import { CaretDownSmallIcon, Icon } from '@tencent/tdesign-icons-vue';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status', title: '状态', width: 100, sortType: 'all', sorter: (a, b) => a.status - b.status,
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
const data = [
  {
    id: 1, instance: 'JQTest1', status: 0, owner: 'jenny;peter', survivalTime: 1000,
  },
  {
    id: 2, instance: 'JQTest2', status: 1, owner: 'jenny', survivalTime: 1000,
  },
  {
    id: 3, instance: 'JQTest3', status: 2, owner: 'jenny', survivalTime: 500,
  },
  {
    id: 4, instance: 'JQTest4', status: 1, owner: 'peter', survivalTime: 1500,
  },
];

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
      multipleSorts: [{
        sortBy: 'status',
        descending: true,
      }],
      allowMultipleSort: false,
      globalLocale: {
        table: {
          sortIcon: (h) => h && <CaretDownSmallIcon size='16px' />,
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
    sortChange(sort, options) {
      this.sort = sort;
      console.log('#### sortChange:', sort, options);
    },
    dataChange(data) {
      this.data = data;
    },
  },
};
</script>
<style lang="less">
/deep/ [class*='t-table-expandable-icon-cell'] .t-icon {
  background-color: transparent;
}

/** 修正自定义排序图标位置 */
.t-table-demo-sort .t-table-sort-desc {
  margin-top: -12px;
}

.demo-container {
  .title {
    font-size: 14px;
    line-height: 28px;
    display: block;
    margin: 10px 0px;
    i {
      font-style: normal;
    }
  }
  .status {
    position: relative;
    color: #00A870;
    margin-left: 10px;
    &::before {
      position: absolute;
      top: 50%;
      left: 0px;
      transform: translateY(-50%);
      content: '';
      background-color: #00A870;
      width: 6px;
      height: 6px;
      margin-left: -10px;
      border-radius: 50%;
    }
  }
  .status.unhealth {
    color: #E34D59;
    &::before {
      background-color: #E34D59;
    }
  }
  .status.warning {
    color: #ED7B2F;
    &::before {
      background-color: #ED7B2F;
    }
  }
}
</style>
