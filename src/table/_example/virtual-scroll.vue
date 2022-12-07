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
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';

const columns = [
  { colKey: 'applicant', title: '申请人', width: '100' },
  {
    colKey: 'status',
    title: '申请状态',
    width: '150',
    cell: (h, { row, rowIndex }) => {
      const status = rowIndex % 3;
      const statusNameListMap = {
        0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
        1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
        2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
      };
      return (
        <t-tag shape="round" theme={statusNameListMap[status].theme} variant="light-outline">
          {statusNameListMap[status].icon}
          {statusNameListMap[status].label}
        </t-tag>
      );
    },
  },
  { colKey: 'matters', title: '申请事项', width: '140' },
  { colKey: 'detail.email', title: '邮箱地址' },
  { colKey: 'createTime', title: '申请时间' },
];

const initialData = [];
for (let i = 0; i < 10; i++) {
  initialData.push({
    id: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['部分宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}
// 为了使得表格滚动更加平稳，建议指定row-height参数值为接近表格的平均行高
const times = Array.from(new Array(600), () => ''); // 测试共计1k条数据
const testData = [];
times.forEach((item, i) => {
  const k = i % 10;
  testData[i] = { ...initialData[k], id: i + 1 };
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
