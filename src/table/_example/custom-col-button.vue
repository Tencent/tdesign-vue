<template>
  <div class="tdesign-demo-block-column-large tdesign-demo__table">
    <!-- 按钮操作区域 -->
    <t-space direction="vertical">
      <t-radio-group v-model="placement" variant="default-filled">
        <t-radio-button value="top-left">左上角</t-radio-button>
        <t-radio-button value="top-right">右上角</t-radio-button>
        <t-radio-button value="bottom-left">左下角</t-radio-button>
        <t-radio-button value="bottom-right">右下角</t-radio-button>
      </t-radio-group>

      <t-space>
        <t-checkbox v-model="bordered">是否显示边框</t-checkbox>
        <t-checkbox v-model="customText" style="margin-left: 16px">自定义列配置按钮</t-checkbox>
      </t-space>
    </t-space>

    <!-- 1. defaultDisplayColumns = ['platform'] 设置默认显示哪些列，仅第一次有效 -->
    <!-- 2. displayColumns 动态设置显示哪些列，受控属性，支持 displayColumns.sync 语法糖 -->
    <!-- 3. onDisplayColumnsChange 当前显示列发生变化时触发 -->
    <!-- 4. 如果希望顶部内容 和 列配置按钮 保持在同一行，可将内容放在 topContent，并调整按钮父元素宽度(CSS) -->
    <!-- 受控用法，示例代码有效，勿删  -->
    <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :displayColumns.sync="displayColumns"
      :columnController="{
        placement,
        fields: ['channel', 'detail.email', 'createTime'],
        dialogProps: { preventScrollThrough: true },
        buttonProps: customText ? { content: '显示列控制', theme: 'primary', variant: 'base' } : undefined,
      }"
      :pagination="{ defaultPageSize: 5, defaultCurrent: 1, total: 100 }"
      :bordered="bordered"
      tableLayout="auto"
      stripe
      drag-sort="col"
      @drag-sort="onDragSortChange"
      @column-change="onColumnChange"
    ></t-table>

    <!-- 非受控用法，示例代码有效，勿删 -->
    <!-- <t-table
      rowKey="index"
      :data="data"
      :columns="columns"
      :columnController="{ displayType: 'fixed-width', fields: ['platform', 'type', 'default'] }"
      tableLayout="auto"
      stripe
      bordered
      @column-change="onColumnChange"
    ></t-table> -->
  </div>
</template>
<script lang="jsx">
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';

const initialData = [];
for (let i = 0; i < 100; i++) {
  initialData.push({
    index: i + 1,
    applicant: ['贾明', '张三', '王芳'][i % 3],
    status: i % 3,
    channel: ['电子签署', '纸质签署', '纸质签署'][i % 3],
    detail: {
      email: ['w.cezkdudy@lhll.au', 'r.nmgw@peurezgn.sl', 'p.cumx@rampblpa.ru'][i % 3],
    },
    matters: ['宣传物料制作费用', 'algolia 服务报销', '相关周边制作费', '激励奖品快递费'][i % 4],
    time: [2, 3, 1, 4][i % 4],
    createTime: ['2022-01-01', '2022-02-01', '2022-03-01', '2022-04-01', '2022-05-01'][i % 4],
  });
}

const staticColumn = ['applicant', 'status'];
export default {
  data() {
    return {
      data: initialData,
      placement: 'top-right',
      customText: false,
      bordered: true,
      displayColumns: staticColumn.concat(['channel', 'detail.email', 'createTime']),
      columns: [
        { colKey: 'applicant', title: '申请人', width: '100' },
        {
          colKey: 'status',
          title: '申请状态',
          width: '150',
          cell: (h, { row }) => {
            const statusNameListMap = {
              0: { label: '审批通过', theme: 'success', icon: <CheckCircleFilledIcon /> },
              1: { label: '审批失败', theme: 'danger', icon: <CloseCircleFilledIcon /> },
              2: { label: '审批过期', theme: 'warning', icon: <ErrorCircleFilledIcon /> },
            };
            return (
              <t-tag shape="round" theme={statusNameListMap[row.status].theme} variant="light-outline">
                {statusNameListMap[row.status].icon}
                {statusNameListMap[row.status].label}
              </t-tag>
            );
          },
        },
        { colKey: 'channel', title: '签署方式', width: '120' },
        { colKey: 'detail.email', title: '邮箱地址', ellipsis: true },
        { colKey: 'createTime', title: '申请时间' },
      ],
    };
  },

  methods: {
    onColumnChange(params) {
      console.log(params);
    },
    onDragSortChange({ newData }) {
      this.columns = newData;
    },
  },
};
</script>
