<template>
  <div>
    <div>
      <t-button theme="default" @click="setData1">设置为全新的数据</t-button>&nbsp;&nbsp;
      <t-button theme="default" @click="setData2">单独设置某行数据</t-button>
    </div>
    <br />
    <!-- 第一列展开树结点，缩进为 24px，子节点字段 childrenKey 默认为 children -->
    <!-- !!! EnhancedTable 才支持，普通 Table 不支持 !!! -->
    <t-enhanced-table
      ref="table"
      rowKey="key"
      :data="data"
      :columns="columns"
      :tree="{ childrenKey: 'list' }"
      :pagination="pagination"
      @page-change="onPageChange"
    ></t-enhanced-table>

    <!-- 第二列展开树结点，缩进为 12px，示例代码有效，勿删 -->
    <!-- indent 定义缩进距离；treeNodeColumnIndex 定义第几列作为树结点展开列 -->
    <!-- 如果子结点字段不是 'children'，可以使用 childrenKey 定义字段别名，如 `:tree="{ childrenKey: 'list' }"` -->
    <!-- <t-enhanced-table
      ref="table"
      rowKey="key"
      :data="data"
      :columns="columns"
      :tree="{ indent: 12, treeNodeColumnIndex: 1, childrenKey: 'list' }"
    ></t-enhanced-table> -->
  </div>
</template>
<script lang="jsx">
import { EnhancedTable } from 'tdesign-vue';

function getData(currentPage = 1) {
  const data = [];
  const pageInfo = `第 ${currentPage} 页`;
  for (let i = 0; i < 5; i++) {
    const obj = {
      key: `我是 ${i} 号（${pageInfo}）`,
      platform: i % 2 === 0 ? '共有' : '私有',
      type: ['String', 'Number', 'Array', 'Object'][i % 4],
      default: ['-', '0', '[]', '{}'][i % 4],
      detail: {
        position: `读取 ${i} 个数据的嵌套信息值`,
      },
      needed: i % 4 === 0 ? '是' : '否',
      description: '数据源',
    };
    obj.list = new Array(2).fill(null).map((t, j) => {
      const secondIndex = 100 * j + (i + 1) * 10;
      const secondObj = {
        ...obj,
        key: `我是 ${secondIndex} 号（${pageInfo}）`,
      };
      secondObj.list = new Array(3).fill(null).map((m, n) => ({
        ...obj,
        key: `我是 ${secondIndex * 1000 + 100 * m + (n + 1) * 10} 号（${pageInfo}）`,
      }));
      return secondObj;
    });
    data.push(obj);
  }
  return data;
}

const data = getData();

export default {
  components: { TEnhancedTable: EnhancedTable },
  data() {
    return {
      data,
      pagination: {
        current: 1,
        pageSize: 10,
        total: 100,
      },
      columns: [
        {
          width: 200,
          className: 'row',
          colKey: 'key',
          title: '编号',
          ellipsis: true,
        },
        {
          colKey: 'platform',
          title: '平台',
        },
        {
          colKey: 'type',
          title: '类型',
        },
        {
          colKey: 'operate',
          width: 300,
          title: '操作',
          align: 'center',
          // 增、删、改、查 等操作
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          cell: (h, { row }) => (
            <div class="tdesign-table-demo__table-operations">
              <t-button variant="text" onClick={() => this.appendTo(row)}>
                插入
              </t-button>
              <t-button variant="text" onClick={() => this.onEditClick(row)}>
                更新
              </t-button>
              <t-button variant="text" onClick={() => this.onLookUp(row)}>
                查看
              </t-button>
              <t-popconfirm content="确认删除吗" onConfirm={() => this.onDeleteConfirm(row)}>
                <t-button variant="text">删除</t-button>
              </t-popconfirm>
            </div>
          ),
        },
      ],
    };
  },

  methods: {
    // 使用 this.$set 或 Vue.set 重置整个表格数据。
    // 这类数据变化，组件内部如果检测新增、删除、变更等，消耗较大，因此这种方式只会重置表格
    setData1() {
      this.$set(this.data, 0, {
        key: '我是 999 号',
        platform: '私有',
        type: 'Number',
        default: 0,
        needed: '否',
        description: '全新数据源',
        list: data[0].list,
      });
    },

    // 使用实例方法 setData(key, newData) 重置单行数据
    setData2() {
      this.$refs.table.setData('我是 110 号', {
        ...data[0].list[1],
        platform: 'New',
        key: '我是 8888 号',
      });
    },

    onEditClick(row) {
      const newData = {
        ...row,
        platform: 'New',
        type: 'Symbol',
        default: 'undefined',
      };
      this.$refs.table.setData(row.key, newData);
      this.$message.success('数据已更新');
    },

    onDeleteConfirm(row) {
      this.$refs.table.remove(row.key);
      this.$message.success('删除成功');
    },

    onLookUp(row) {
      const allRowData = this.$refs.table.getData(row.key);
      const message = '当前行全部数据，包含节点路径、父节点、子节点、是否展开、是否禁用等';
      this.$message.success(`打开控制台查看${message}`);
      console.log(`${message}：`, allRowData);
    },

    appendTo(row) {
      const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
      this.$refs.table.appendTo(row.key, {
        key: `我是 ${randomKey} 号`,
        platform: '私有',
        type: 'Number',
      });
      this.$message.success(`已插入子节点我是 ${randomKey} 号，请展开查看`);
    },

    onPageChange(pageInfo) {
      this.pagination = {
        ...this.pagination,
        ...pageInfo,
      };
      this.data = getData(pageInfo.current);
    },
  },
};
</script>

<style>
.tdesign-table-demo__table-operations div {
  display: inline-block;
}
.tdesign-table-demo__table-operations .t-button {
  padding: 0 8px;
}
</style>
