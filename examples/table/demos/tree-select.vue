<template>
  <div class="t-table-tree-select-demo">
    <div>
      <t-radio-group v-model="checkStrictly" variant="default-filled">
        <t-radio-button value="true">父子行选中独立</t-radio-button>
        <t-radio-button value="false">
          <t-popup
            content="「父子行选中关联」由于表格数据的特殊性，父节点选中或者取消选中，会影响子节点；但子节点选中或取消不影响父元素"
          >
            父子行选中关联
          </t-popup>
        </t-radio-button>
      </t-radio-group>
    </div>
    <br />
    <!-- 子节点字段不是 children，而是 childrenList -->
    <!-- expandedRow 和 expanded-row-keys 控制是否显示展开收起行，以及哪些行展开 -->
    <!-- !!! EnhancedTable 才支持，普通 Table 不支持 !!! -->
    <t-enhanced-table
      row-key="key"
      :expandedRow="expandedRowRender"
      :expanded-row-keys="expandedRowKeys"
      @expand-change="onExpandChange"
      :columns="columns"
      :data="data"
      :tree="{
        childrenKey: 'childrenList',
        checkStrictly: checkStrictly === 'true' ? true : false,
      }"
      :selected-row-keys="selectedRowKeys"
      @select-change="rehandleSelectChange"
    ></t-enhanced-table>
  </div>
</template>

<script lang="jsx">
import { EnhancedTable } from 'tdesign-vue';
import cloneDeep from 'lodash/cloneDeep';

const data = [];
for (let i = 0; i < 5; i++) {
  const obj = {
    key: i,
    instance: `JQTest${i}`,
    status: i % 2,
    owner: i % 2 === 0 ? 'jenny' : 'peter',
    description: 'important.',
  };
  obj.childrenList = new Array(5).fill(null).map((t, j) => {
    const secondIndex = 100 * j + (i + 1) * 10;
    const secondObj = {
      ...obj,
      status: secondIndex % 3,
      key: secondIndex,
      instance: `JQTest${secondIndex}`,
    };
    secondObj.childrenList = new Array(5).fill(null).map((m, n) => {
      const thirdIndex = secondIndex * 1000 + 100 * m + (n + 1) * 10;
      return {
        ...obj,
        status: thirdIndex % 3,
        key: thirdIndex,
        instance: `JQTest${thirdIndex}`,
      };
    });
    return secondObj;
  });
  data.push(obj);
}

export default {
  components: { TEnhancedTable: EnhancedTable },

  data() {
    return {
      checkStrictly: 'true',
      selectedRowKeys: [],
      expandedRowKeys: [],
      columns: [
        {
          colKey: 'row-select',
          type: 'multiple',
          // 禁用行选中方式一：使用 disabled 禁用行（示例代码有效，勿删）。disabled 参数：{row: RowData; rowIndex: number })
          // 这种方式禁用行选中，当前行会添加行类名 t-table__row--disabled，禁用行文字变灰
          // disabled: ({ rowIndex }) => rowIndex === 1 || rowIndex === 3,

          // 禁用行选中方式二：使用 checkProps 禁用行（示例代码有效，勿删）
          // 这种方式禁用行选中，行文本不会变灰
          checkProps: ({ row }) => ({ disabled: !row.childrenList && row.status !== 0 }),
          // 自由调整宽度，如果发现元素看不见，请加大宽度
          width: 20,
        },
        {
          colKey: 'instance',
          title: '集群名称',
          width: 200,
        },
        {
          colKey: 'status',
          title: '状态',
          width: 100,
          cell: (h, { row }) => (row.status === 0 ? <p class="status">健康</p> : <p class="status unhealth">异常</p>),
        },
        { colKey: 'owner', title: '管理员' },
        { colKey: 'description', title: '描述' },
      ],
      data,
    };
  },

  watch: {
    // 切换模式，重置数据，避免互相影响
    checkStrictly() {
      this.selectedRowKeys = [];
      this.data = cloneDeep(data);
    },
  },

  methods: {
    rehandleClickOp({ text, row }) {
      console.log(text, row);
    },

    rehandleSelectChange(value, { selectedRowData }) {
      this.selectedRowKeys = value;
      console.log(value, selectedRowData);
    },

    expandedRowRender(h, { row }) {
      return <div>这是展开项数据，我是 {row.key} 号</div>;
    },

    onExpandChange(val) {
      this.expandedRowKeys = val;
    },
  },
};
</script>

<style lang="less">
.t-table-tree-select-demo {
  .link {
    cursor: pointer;
    margin-right: 15px;
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
}
</style>
