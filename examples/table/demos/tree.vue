<template>
  <div>
    <div>
      <t-button theme="default" @click="setData1">重置数据</t-button>
      <t-button theme="default" style="margin-left: 16px" @click="onRowToggle">展开/收起可见行</t-button>
    </div>
    <br />
    <!-- 第一列展开树结点，缩进为 24px，子节点字段 childrenKey 默认为 children -->
    <!-- !!! 树形结构 EnhancedTable 才支持，普通 Table 不支持 !!! -->
    <!-- treeNodeColumnIndex 定义第几列作为树结点展开列，默认为第一列 -->
    <t-enhanced-table
      ref="table"
      rowKey="key"
      :data="data"
      :columns="columns"
      :tree="{ childrenKey: 'list', treeNodeColumnIndex: 1 }"
      :pagination="pagination"
      @page-change="onPageChange"
    ></t-enhanced-table>

    <!-- 第二列展开树结点，缩进为 12px，示例代码有效，勿删 -->
    <!-- indent 定义缩进距离 -->
    <!-- 如果子结点字段不是 'children'，可以使用 childrenKey 定义字段别名，如 `:tree="{ childrenKey: 'list' }"` -->
    <!-- <t-enhanced-table
      ref="table"
      rowKey="key"
      :pagination="defaultPagination"
      :data="data"
      :columns="columns"
      :tree="{ indent: 12, childrenKey: 'list' }"
      @page-change="onPageChange"
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
      id: i,
      key: `我是 ${i}_${currentPage} 号（${pageInfo}）`,
      platform: i % 2 === 0 ? '共有' : '私有',
      type: ['String', 'Number', 'Array', 'Object'][i % 4],
      default: ['-', '0', '[]', '{}'][i % 4],
      detail: {
        position: `读取 ${i} 个数据的嵌套信息值`,
      },
      needed: i % 4 === 0 ? '是' : '否',
      description: '数据源',
    };
    // 第一行不设置子节点
    obj.list = i === 0
      ? []
      : new Array(2).fill(null).map((t, j) => {
        const secondIndex = 100 * j + (i + 1) * 10;
        const secondObj = {
          ...obj,
          id: secondIndex,
          key: `我是 ${secondIndex}_${currentPage} 号（${pageInfo}）`,
        };
        secondObj.list = new Array(3).fill(null).map((m, n) => {
          const thirdIndex = secondIndex * 1000 + 100 * m + (n + 1) * 10;
          return {
            ...obj,
            id: thirdIndex,
            key: `我是 ${thirdIndex}_${currentPage} 号（${pageInfo}）`,
          };
        });
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
      defaultPagination: {
        defaultCurrent: 1,
        defaultPageSize: 10,
        total: 100,
      },
      columns: [
        {
          colKey: 'id',
          title: '编号',
          ellipsis: true,
        },
        {
          width: 220,
          colKey: 'key',
          title: '名称',
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
          width: 280,
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
    // 全新赋值
    setData1() {
      this.data = getData();
    },

    // 更新
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

    // 删除
    onDeleteConfirm(row) {
      this.$refs.table.remove(row.key);
      this.$message.success('删除成功');
    },

    // 查看数据
    onLookUp(row) {
      const allRowData = this.$refs.table.getData(row.key);
      const message = '当前行全部数据，包含节点路径、父节点、子节点、是否展开、是否禁用等';
      this.$message.success(`打开控制台查看${message}`);
      console.log(`${message}：`, allRowData);
    },

    // 新增
    appendTo(row) {
      const randomKey = Math.round(Math.random() * Math.random() * 1000) + 10000;
      this.$refs.table.appendTo(row.key, {
        id: randomKey,
        key: `我是 ${randomKey} 号`,
        platform: '私有',
        type: 'Number',
      });
      this.$message.success(`已插入子节点我是 ${randomKey} 号，请展开查看`);
    },

    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.data = getData(pageInfo.current);
    },

    onRowToggle() {
      const rowIds = [
        '我是 1_1 号（第 1 页）',
        '我是 2_1 号（第 1 页）',
        '我是 3_1 号（第 1 页）',
        '我是 4_1 号（第 1 页）',
      ];
      rowIds.forEach((id) => {
        // getData 参数为行唯一标识，lodash.get(row, rowKey)
        const rowData = this.$refs.table.getData(id);
        this.$refs.table.toggleExpandData(rowData);
        // 或者
        // this.$refs.table.toggleExpandData({ rowIndex: rowData.rowIndex, row: rowData.row });
      });
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
