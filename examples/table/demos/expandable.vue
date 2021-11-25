<template>
  <div class="tdesign-demo-block-column">
    <!-- t-locale-provider 一般用于全局配置某个组件的特性，此代码示例 示范了如何对表格扩展图标进行统一配置 -->
    <!-- `globalLocale.table.expandIcon` 可用于自定义展开箭头图标 -->
    <!-- <t-locale-provider :globalLocale="globalLocale"> -->

    <!-- expanded-row-keys 为受控属性 -->
    <!-- default-expanded-row-keys 为非受控属性 -->

    <div>
      <t-radio-group v-model="expandControl" variant="default-filled">
        <t-radio-button value="true">显示展开图标</t-radio-button>
        <t-radio-button value="false">隐藏展开图标</t-radio-button>
        <t-radio-button value="custom">自定义展开图标</t-radio-button>
      </t-radio-group>
    </div>

    <t-checkbox v-model="expandOnRowClick">允许点击行之后展开/收起</t-checkbox>

    <t-table
      row-key='id'
      :columns="columns"
      :data="data"
      :expanded-row-keys="expandedRowKeys"
      :expanded-row="expandedRow"
      @expand-change="rehandleExpandChange"
      :expandIcon="expandIcon"
      :expandOnRowClick="expandOnRowClick"
    >
      <template #status="{ row }">
        <p v-if="row.status === 0" class="status">健康</p>
        <p v-if="row.status === 1" class="status unhealth">异常</p>
      </template>
      <template #op-column><p>操作</p></template>
      <template #op="slotProps">
        <a class="link" @click="rehandleClickOp(slotProps)">管理</a>
        <a class="link" @click="rehandleClickOp(slotProps)">删除</a>
      </template>
    </t-table>

    <!-- </t-locale-provider> -->
  </div>
</template>

<script>
import { ChevronRightIcon, ChevronRightCircleIcon } from 'tdesign-icons-vue';

const columns = [
  { colKey: 'instance', title: '集群名称', width: 150 },
  {
    colKey: 'status', title: '状态', width: 100, cell: 'status',
  },
  { colKey: 'owner', title: '管理员' },
  { colKey: 'description', title: '描述' },
  {
    colKey: 'op', width: 200, title: 'op-column', cell: 'op',
  },
];
const data = [
  {
    id: 1, instance: '集群测试1', status: 0, owner: 'jenny;peter', description: '隐藏展开图标',
  },
  {
    id: '2', instance: '集群测试2', status: 1, owner: 'jenny', description: 'test',
  },
  {
    id: 3, instance: '集群测试3', status: 0, owner: 'jenny', description: '自定义图标',
  },
  {
    id: 4, instance: '集群测试4', status: 1, owner: 'peter', description: 'test',
  },
];
export default {
  data() {
    return {
      expandControl: 'true',
      expandIcon: true,
      expandOnRowClick: true,
      columns,
      data,
      // 有哪些 data.id 在 expandedRowKeys 中，就显示这些 id 对应的行
      expandedRowKeys: ['2'],
      // defaultExpandedRowKeys: ['2', 4],
      expandedRow: (h, { row }) => (
        <div class="more-detail">
          <p class="title"><b>集群名称:</b></p><p class="content">{row.instance}</p><br/>
          <p class="title"><b>管理员:</b></p><p class="content">{row.owner}</p><br/>
          <p class="title"><b>描述:</b></p><p class="content">{row.description}</p>
        </div>
      ),
      globalLocale: {
        table: {
          expandIcon: (h) => h && <ChevronRightIcon />,
        },
      },
    };
  },
  watch: {
    expandControl(val) {
      if (val === 'true') {
        // expandIcon 默认为 true，表示显示默认展开图标
        this.expandIcon = true;
      } else if (val === 'false') {
        // expandIcon 值为 false，则表示隐藏全部展开图标
        this.expandIcon = false;
      } else if (val === 'custom') {
        // 完全自由控制表格的每一行是否显示展开图标，以及显示什么内容
        this.expandIcon = (h, { row, index }) => {
          // 第一行不显示展开图标
          if (index === 0) return false;
          // 第三行，使用自定义展开图标
          if (row.id === 3) return <ChevronRightIcon />;
          // 其他行，使用表格同款展开图标
          return <ChevronRightCircleIcon />;
        };
      }
    },
  },
  methods: {
    rehandleClickOp({ text, row }) {
      console.log(text, row);
    },
    rehandleExpandChange(value, { expandedRowData }) {
      this.expandedRowKeys = value;
      console.log('rehandleExpandChange', value, expandedRowData);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ [class*='t-table-expandable-icon-cell'] .t-icon {
  background-color: transparent;
}
.link {
  cursor: pointer;
  margin-right: 15px;
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
.more-detail {
  > p {
    display: inline-block;
    margin: 5px;
  }
  > p.title {
    width: 100px;
  }
}
</style>
