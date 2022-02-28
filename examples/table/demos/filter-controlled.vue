<template>
  <div class="tdesign-demo-block-column">
    <div>
      <t-button @click="setFilters">清除筛选条件</t-button>
      <span style="padding-left: 36px">已选筛选条件：{{ filterValue }}</span>
    </div>

    <!-- 此处代码有效，勿删！支持语法糖 filter-value.sync ， 支持非受控属性 defaultfilterValue -->
    <!-- 其中，filterIcon 用于自定义筛选图标。 -->
    <!-- <t-table
      rowKey='key'
      :columns="columns"
      :data="data"
      :filter-value.sync="filterValue"
      :filterIcon="filterIcon"
    >
      <template #filterRow>自定义过滤行信息</template>
    </t-table> -->

    <!-- filter-value.sync 等同于 filter-value + filter-change -->
    <t-table rowKey="key" :columns="columns" :data="data" :filter-value="filterValue" @filter-change="onFilterChange" />
  </div>
</template>

<script lang="jsx">
const data = [
  {
    key: '1',
    firstName: 'Eric',
    lastName: 'Spinke',
    email: 'espinke0@apache.org',
    createTime: '2021-11-01',
  },
  {
    key: '2',
    firstName: 'Gilberta',
    lastName: 'Purves',
    email: 'gpurves1@issuu.com',
    createTime: '2021-12-01',
  },
  {
    key: '3',
    firstName: 'Heriberto',
    lastName: 'Kment',
    email: 'hkment2@nsw.gov.au',
    createTime: '2022-01-01',
  },
  {
    key: '4',
    firstName: 'Lazarus',
    lastName: 'Skures',
    email: 'lskures3@apache.org',
    createTime: '2022-02-01',
  },
  {
    key: '5',
    firstName: 'Zandra',
    lastName: 'Croson',
    email: 'zcroson5@virginia.edu',
    createTime: '2022-03-01',
  },
];

export default {
  data() {
    return {
      data,
      filterValue: {},
      columns: [
        {
          title: 'FirstName',
          colKey: 'firstName',
          // 单选过滤配置
          filter: {
            type: 'single',
            // showConfirmAndReset: true,
            list: [
              { label: 'anyone', value: '' },
              { label: 'Heriberto', value: 'Heriberto' },
              { label: 'Eric', value: 'Eric' },
            ],
          },
        },
        {
          title: 'LastName',
          colKey: 'lastName',
          // 多选过滤配置
          filter: {
            type: 'multiple',
            // 是否显示重置取消按钮，一般情况不需要显示
            showConfirmAndReset: true,
            list: [
              { label: 'All', checkAll: true },
              { label: 'Skures', value: 'Skures' },
              { label: 'Purves', value: 'Purves' },
            ],
          },
        },
        {
          title: 'Email',
          colKey: 'email',
          // 输入框过滤配置
          filter: {
            type: 'input',
            resetValue: '@',
            props: {
              placeholder: '输入关键词过滤',
              clearable: true,
            },
            // 是否显示重置取消按钮
            showConfirmAndReset: true,
          },
        },
        {
          title: 'Date',
          colKey: 'createTime',
          // 自定义过滤组件
          filter: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            component: (h) => <t-date-picker clearable />,
          },
        },
      ],
    };
  },
  methods: {
    // filters 参数包含自定义过滤组件 日期选择器 的值
    onFilterChange(filters) {
      this.filterValue = filters;
      // 模拟异步请求进行数据过滤
      this.request(this.filterValue);
    },
    setFilters() {
      this.filterValue = {};
      this.data = data;
    },
    filterIcon(h) {
      console.log(h);
      return <i>icon</i>;
    },
    request(filters) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        this.data = data.filter((item) => {
          let result = true;
          if (filters.firstName) {
            result = item.firstName === filters.firstName;
          }
          if (result && filters.lastName && filters.lastName.length) {
            result = filters.lastName.includes(item.lastName);
          }
          if (result && filters.email) {
            result = item.email.indexOf(filters.email) !== -1;
          }
          if (result && filters.createTime) {
            result = item.createTime === filters.createTime;
          }
          return result;
        });
      }, 100);
    },
  },
};
</script>
