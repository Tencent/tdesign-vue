<template>
  <t-table
    :data="data"
    :columns="columns"
    :rowKey="rowKey"
    :loading="isLoading"
    :pagination="pagination"
    @change="rehandleChange"
    @page-change="onPageChange"
    bordered
    stripe
  >
  </t-table>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      isLoading: false,
      columns: [
        {
          width: 200,
          colKey: 'name',
          title: '姓名',
          render(h, { row: { name } }) {
            return name ? `${name.first} ${name.last}` : 'UNKNOWN_USER';
          },
        },
        {
          width: 200,
          colKey: 'gender',
          title: '性别',
        },
        {
          width: 200,
          colKey: 'phone',
          title: '联系方式',
          render(h, { row: { phone } }) {
            return phone;
          },
        },
        {
          width: 260,
          colKey: 'email',
          title: '邮箱',
          ellipsis: true,
        },
      ],
      rowKey: 'phone',
      tableLayout: 'auto',
      rowClassName: 'property-class',
      pagination: {
        current: 1,
        pageSize: 10,
        // defaultCurrent: 1,
        // defaultPageSize: 10,
        showJumper: true,
        onChange: (pageInfo) => {
          console.log('pagination.onChange', pageInfo);
        },
      },
    };
  },
  async mounted() {
    await this.fetchData({
      current: this.pagination.current || this.pagination.defaultCurrent,
      pageSize: this.pagination.pageSize || this.pagination.defaultPageSize,
    });
  },
  methods: {
    async fetchData(pagination = this.pagination) {
      try {
        this.isLoading = true;
        const { current, pageSize } = pagination;
        // 请求可能存在跨域问题
        const url = new URL('https://randomuser.me/api');
        const params = { page: current, results: pageSize };
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
        const response = await fetch(url).then((x) => x.json());
        this.data = response.results;
        // 数据加载完成，设置数据总条数
        this.pagination.total = 120;
      } catch (err) {
        this.data = [];
      }
      this.isLoading = false;
    },

    // BaseTable 中只有 page-change 事件，没有 change 事件
    rehandleChange(changeParams, triggerAndData) {
      console.log('分页、排序、过滤等发生变化时会触发 change 事件：', changeParams, triggerAndData);
    },

    // BaseTable 中只有 page-change 事件，没有 change 事件
    async onPageChange(pageInfo) {
      console.log('page-change', pageInfo);
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      await this.fetchData(pageInfo);
    },
  },
};
</script>
