<template>
  <div class="t-table-demo__editable-row">
    <div>
      <t-button @click="onValidateTableData">校验全部</t-button>
    </div>
    <br />
    <!-- 当前示例包含：输入框、单选、多选、日期 等场景 -->
    <t-table
      ref="tableRef"
      row-key="key"
      :columns="columns"
      :data="data"
      :editable-row-keys="editableRowKeys"
      vertical-align="top"
      bordered
      @row-edit="onRowEdit"
      @row-validate="onRowValidate"
      @validate="onValidate"
    />
  </div>
</template>

<script lang="jsx">
import {
  Input, Select, DatePicker, MessagePlugin, Button,
} from 'tdesign-vue';
import dayjs from 'dayjs';

const initData = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  firstName: ['Eric', 'Gilberta', 'Heriberto', 'Lazarus', 'Zandra'][i % 4],
  framework: ['Vue', 'React', 'Miniprogram', 'Flutter'][i % 4],
  email: [
    'espinke0@apache.org',
    'gpurves1@issuu.com',
    'hkment2@nsw.gov.au',
    'lskures3@apache.org',
    'zcroson5@virginia.edu',
  ][i % 4],
  letters: [['A'], ['B', 'E'], ['C'], ['D', 'G', 'H']][i % 4],
  createTime: ['2021-11-01', '2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01'][i % 4],
}));

export default {
  name: 'TTableEditableCell',

  data() {
    return {
      align: 'left',
      data: [...initData],
      editableRowKeys: ['1'],
      currentSaveId: '',
      // 保存变化过的行信息
      editMap: {},
    };
  },

  computed: {
    columns() {
      return [
        {
          title: 'FirstName',
          colKey: 'firstName',
          align: this.align,
          // 编辑状态相关配置，全部集中在 edit
          edit: {
            // 1. 支持任意组件。需保证组件包含 `value` 和 `onChange` 两个属性，且 onChange 的第一个参数值为 new value。
            // 2. 如果希望支持校验，组件还需包含 `status` 和 `tips` 属性。具体 API 含义参考 Input 组件
            component: Input,
            // props, 透传全部属性到 Input 组件
            props: {
              clearable: true,
              autofocus: true,
              autoWidth: true,
            },
            // 校验规则，此处同 Form 表单
            rules: [
              { required: true, message: '不能为空' },
              { max: 10, message: '字符数量不能超过 10', type: 'warning' },
            ],
            showEditIcon: false,
          },
        },
        {
          title: 'Framework',
          colKey: 'framework',
          edit: {
            component: Select,
            // props, 透传全部属性到 Select 组件
            props: {
              clearable: true,
              options: [
                { label: 'Vue', value: 'Vue' },
                { label: 'React', value: 'React' },
                { label: 'Miniprogram', value: 'Miniprogram' },
                { label: 'Flutter', value: 'Flutter' },
              ],
            },
            // 校验规则，此处同 Form 表单
            rules: [{ required: true, message: '不能为空' }],
            showEditIcon: false,
          },
        },
        {
          title: 'Letters',
          colKey: 'letters',
          cell: (h, { row }) => row.letters.join('、'),
          edit: {
            component: Select,
            // props, 透传全部属性到 Select 组件
            // props 为函数时，参数有：col, row, rowIndex, colIndex, editedRow。一般用于实现编辑组件之间的联动
            props: ({
              col, row, rowIndex, colIndex, editedRow,
            }) => {
              console.log(col, row, rowIndex, colIndex, editedRow);
              return {
                multiple: true,
                minCollapsedNum: 1,
                options: [
                  { label: 'A', value: 'A' },
                  { label: 'B', value: 'B' },
                  { label: 'C', value: 'C' },
                  { label: 'D', value: 'D' },
                  { label: 'E', value: 'E' },
                  // 如果框架选择了 React，则 Letters 隐藏 G 和 H
                  { label: 'G', value: 'G', show: () => editedRow.framework !== 'React' },
                  { label: 'H', value: 'H', show: () => editedRow.framework !== 'React' },
                ].filter((t) => (t.show === undefined ? true : t.show())),
              };
            },
            // 校验规则，此处同 Form 表单
            rules: [{ validator: (val) => val && val.length < 3, message: '数量不能超过 2 个' }],
            showEditIcon: false,
          },
        },
        {
          title: 'Date',
          colKey: 'createTime',
          className: 't-demo-col__datepicker',
          // props, 透传全部属性到 DatePicker 组件
          edit: {
            component: DatePicker,
            showEditIcon: false,
            // 校验规则，此处同 Form 表单
            rules: [
              {
                validator: (val) => dayjs(val).isAfter(dayjs()),
                message: '只能选择今天以后日期',
              },
            ],
          },
        },
        {
          title: 'Operate',
          colKey: 'operate',
          width: 150,
          cell: (h, { row }) => {
            const editable = this.editableRowKeys.includes(row.key);
            return (
              <div class="table-operations">
                {!editable && (
                  <Button theme="primary" variant="text" data-id={row.key} onClick={this.onEdit}>
                    编辑
                  </Button>
                )}
                {editable && (
                  <Button theme="primary" variant="text" data-id={row.key} onClick={this.onSave}>
                    保存
                  </Button>
                )}
                {editable && (
                  <Button theme="primary" variant="text" data-id={row.key} onClick={this.onCancel}>
                    取消
                  </Button>
                )}
              </div>
            );
          },
        },
      ];
    },
  },

  methods: {
    onEdit(e) {
      const { id } = e.currentTarget.dataset;
      if (!this.editableRowKeys.includes(id)) {
        this.editableRowKeys.push(id);
      }
    },
    updateEditState(id) {
      const index = this.editableRowKeys.findIndex((t) => t === id);
      this.editableRowKeys.splice(index, 1);
    },
    onCancel(e) {
      const { id } = e.currentTarget.dataset;
      this.updateEditState(id);
      this.$refs.tableRef.clearValidateData();
    },

    onSave(e) {
      const { id } = e.currentTarget.dataset;
      this.currentSaveId = id;
      // 触发内部校验，而后在 onRowValidate 中接收异步校验结果
      // 重点：受框架层面限制，如果是 EnhancedTable 请更为使用 this.$refs.tableRef.enhancedTableRef.validateRowData(id)
      // this.$refs.tableRef.enhancedTableRef.validateRowData(id).then((params) => {
      this.$refs.tableRef.validateRowData(id).then((params) => {
        console.log('Event Table Promise Validate:', params);
        if (params.result.length) {
          const r = params.result[0];
          MessagePlugin.error(`${r.col.title} ${r.errorList[0].message}`);
          return;
        }
        // 如果是 table 的父组件主动触发校验
        if (params.trigger === 'parent' && !params.result.length) {
          const current = this.editMap[this.currentSaveId];
          if (current) {
            this.data.splice(current.rowIndex, 1, current.editedRow);
            MessagePlugin.success('保存成功');
          }
          this.updateEditState(this.currentSaveId);
        }
      });
    },

    // 行校验反馈事件，this.$refs.tableRef.validateRowData 执行结束后触发
    onRowValidate(params) {
      console.log('Event Table Row Validate:', params);
    },

    onValidateTableData() {
      // 执行结束后触发事件 validate
      this.$refs.tableRef.validateTableData().then((params) => {
        console.log('Promise Table Data Validate:', params);
        const cellKeys = Object.keys(params.result);
        const firstError = params.result[cellKeys[0]];
        if (firstError) {
          MessagePlugin.warning(firstError[0].message);
        }
      });
    },

    // 表格全量数据校验反馈事件，this.$refs.tableRef.validateTableData() 执行结束后触发
    onValidate(params) {
      console.log('Event Table Data Validate:', params);
    },

    onRowEdit(params) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        row,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        rowIndex,
        col,
        value,
      } = params;
      const oldRowData = this.editMap[row.key]?.editedRow || row;
      const editedRow = { ...oldRowData, [col.colKey]: value };
      this.editMap[row.key] = {
        ...params,
        editedRow,
      };

      // ⚠️ 重要：以下内容应用于全量数据校验（单独的行校验不需要）
      // const newData = [...this.data];
      // newData[rowIndex] = editedRow;
      // this.data = newData;
      // 或者
      // this.$set(this.data, rowIndex, editedRow);
    },
  },
};
</script>

<style>
.t-table-demo__editable-row .table-operations > button {
  padding: 0 8px;
  line-height: 22px;
  height: 22px;
}
.t-table-demo__editable-row .t-demo-col__datepicker .t-date-picker {
  width: 120px;
}
</style>
