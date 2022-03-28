<template>
  <div class="demo-container t-table-demo-sort">
    <div class="item">
      <!-- 拖拽排序涉及到 data 的变更，相对比较慎重，因此仅支持受控用法 -->

      <t-table rowKey="id" :columns="columns" :data="data" @drag-sort="onDragSort" dragSort="drag-col">
        <template #status="{ row }">
          <p class="status" :class="['', 'warning', 'unhealth'][row.status]">
            {{ ['健康', '警告', '异常'][row.status] }}
          </p>
        </template>
      </t-table>
    </div>
  </div>
</template>

<script lang="jsx">
import { MoveIcon } from 'tdesign-icons-vue';

const columns = [
  {
    colKey: 'drag',
    title: '排序',
    width: 100,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cell: (h) => <MoveIcon />,
  },
  { colKey: 'instance', title: '集群名称22', width: 150 },
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

const data = [
  {
    id: 1,
    instance: 'JQTest1',
    status: 0,
    owner: 'jenny;peter',
    survivalTime: 1000,
  },
  {
    id: 2,
    instance: 'JQTest2',
    status: 1,
    owner: 'jenny',
    survivalTime: 1000,
  },
  {
    id: 3,
    instance: 'JQTest3',
    status: 2,
    owner: 'jenny',
    survivalTime: 500,
  },
  {
    id: 4,
    instance: 'JQTest4',
    status: 1,
    owner: 'peter',
    survivalTime: 1500,
  },
];

export default {
  data() {
    return {
      data,
      columns,
    };
  },
  methods: {
    // 必须手动实现交换数据，否则data不会发生变异
    onDragSort({
      currentIndex, current, targetIndex, target, currentData, e,
    }) {
      console.log('交换行', currentIndex, current, targetIndex, target, currentData, e);
      // const newData = [].concat(this.data);
      // if (targetIndex - currentIndex > 0) {
      //   newData.splice(targetIndex + 1, 0, this.data[currentIndex]);
      //   newData.splice(currentIndex, 1);
      // } else {
      //   newData.splice(targetIndex, 0, this.data[currentIndex]);
      //   newData.splice(currentIndex + 1, 1);
      // }
      // this.data = newData;
      this.data = currentData;
    },
  },
};
</script>
<style scoped lang="less">
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
    color: #00a870;
    margin-left: 10px;
    &::before {
      position: absolute;
      top: 50%;
      left: 0px;
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
