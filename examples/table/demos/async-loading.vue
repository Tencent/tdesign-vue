<template>
  <div>
    <t-radio-group v-model="asyncLoading">
      <t-radio-button value="load-more">加载更多</t-radio-button>
      <t-radio-button value="loading">加载中</t-radio-button>
      <t-radio-button value="loading-custom">自定义加载更多</t-radio-button>
    </t-radio-group>

    <t-table
      rowKey="key"
      :columns="columns"
      :data="data"
      :asyncLoading="loadingNode"
      @async-loading-click="onAsyncLoadingClick"
    ></t-table>
  </div>
</template>

<script>
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 20,
    address: 'Sidney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 31,
    address: 'London No. 2 Lake Park',
  },
  {
    key: '5',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const columns = [
  {
    title: 'Name',
    colKey: 'name',
    width: '100',
  },
  {
    title: 'Age',
    colKey: 'age',
    width: '100',
  },
  {
    title: 'Address',
    colKey: 'address',
    width: '250',
  },
];

export default {
  data() {
    return {
      data,
      columns,
      asyncLoading: 'loading',
    };
  },
  computed: {
    loadingNode() {
      return this.asyncLoading === 'loading-custom'
        ? this.customLoadingNode
        : this.asyncLoading;
    },
  },
  methods: {
    customLoadingNode(h) {
      return <div class='t-table--loading-async'>这是自定义加载状态和内容</div>;
    },
    onAsyncLoadingClick({ status }) {
      if (status === 'load-more') {
        this.asyncLoading = 'loading';
      }
    },
  },
};
</script>
