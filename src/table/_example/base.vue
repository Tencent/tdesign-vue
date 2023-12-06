<template>
  <div>
    <t-button @click="prev">上一页</t-button>
    <t-button @click="next">下一页</t-button>
    <t-checkbox v-model="showPagination">showPagination</t-checkbox>
    <t-table
      :data="data"
      :columns="columns"
      :rowKey="rowKey"
      :pagination="pagination"
      @change="rehandleChange"
      @page-change="onPageChange"
      bordered
      stripe
    >
    </t-table>
  </div>
</template>

<script>
import { ErrorCircleFilledIcon, CheckCircleFilledIcon, CloseCircleFilledIcon } from 'tdesign-icons-vue';
import WorkHistory from 'tdesign-icons-vue/lib/components/work-history';

export default {
  data() {
    return {
      data: [],
      isLoading: false,
      showPagination: false,
      selectedRowKeys: [],
      columns: [
        {
          colKey: 'serial-number',
          title: '序号',
          width: 80,
        },
        {
          colKey: 'row-select',
          type: 'multiple',
          width: 46,
        },
        {
          width: 200,
          colKey: 'name',
          title: '姓名',
          render(h, { type, row: { name } }) {
            if (type === 'title') return '申请人';
            return name ? `${name.first} ${name.last}` : 'UNKNOWN_USER';
          },
        },
        {
          colKey: 'status',
          title: '申请状态',
          width: '150',
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
          colKey: 'email',
          title: '邮箱',
          width: 180,
          ellipsis: true,
        },
      ],
      rowKey: 'phone',
      tableLayout: 'auto',
      rowClassName: 'property-class',
      // pagination: {
      //   current: 1,
      //   pageSize: 10,
      //   // defaultCurrent: 1,
      //   // defaultPageSize: 10,
      //   showJumper: true,
      // },
    };
  },
  computed: {
    pagination() {
      return this.showPagination ? {
        // current: 1,
        // pageSize: 10,
        defaultCurrent: 1,
        defaultPageSize: 3,
        showJumper: true,
        total: 102,
      }: undefined;
    },
  },
  async mounted() {
    await this.fetchData({
      current: this.pagination?.current || this.pagination?.defaultCurrent || 1,
      pageSize: this.pagination?.pageSize || this.pagination?.defaultPageSize || 3,
    });
  },
  watch: {
    async pagination(val) {
      // if (!this.pagination) return;
      // await this.fetchData({
      //   current: this.pagination.current || this.pagination.defaultCurrent,
      //   pageSize: this.pagination.pageSize || this.pagination.defaultPageSize,
      // });
    }
  },
  methods: {
    async fetchData(pagination = { current: 1, pageSize: 3 }) {
      try {
        this.isLoading = true;
        const { current, pageSize } = pagination;
        // 请求可能存在跨域问题
        const url = new URL('https://randomuser.me/api');
        const params = { page: 1, results: 13 };
        Object.keys(params).forEach((key) => url.searchParams.append(key, params[key]));
        const response = await fetch(url).then((x) => x.json());
        this.data = response.results;
        // 数据加载完成，设置数据总条数
        // this.pagination.total = 120;
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

    onSelectChange(value, { selectedRowData }) {
      this.selectedRowKeys = value;
      console.log(value, selectedRowData);
    },
    // 上一页
    prev() {
      this.pagination.current = Math.max(1, this.pagination.current - 1);
      // this.onPageChange(this.pagination);
    },
    // 下一页
    next() {
      this.pagination.current = Math.min(
        Math.ceil(this.pagination.total, this.pagination.pageSize),
        this.pagination.current + 1,
      );
      // this.onPageChange(this.pagination);
    },
  },
};
</script>
