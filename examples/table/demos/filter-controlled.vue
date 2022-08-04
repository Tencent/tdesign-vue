<template>
  <div class="tdesign-demo-block-column">
    <!-- 是否显示表格边框 和 对齐方式都决定着 排序图标 和 筛选图标的排列位置 -->
    <div>
      <t-radio-group v-model="align" variant="default-filled">
        <t-radio-button value="left">左对齐</t-radio-button>
        <t-radio-button value="center">居中对齐</t-radio-button>
        <t-radio-button value="right">右对齐</t-radio-button>
      </t-radio-group>
      <t-button @click="setFilters" variant="text" style="margin-left: 36px">清除筛选条件</t-button>
      <span style="padding-left: 36px">已选筛选条件：{{ filterValue }}</span>
    </div>
    <div>
      <t-checkbox v-model="bordered">是否显示表格边框</t-checkbox>
    </div>

    <!-- 1. 此处代码有效，勿删！支持语法糖 filter-value.sync ， 支持非受控属性 defaultFilterValue -->
    <!-- 2. 其中，filterIcon 用于自定义筛选图标，支持渲染函数 props.filterIcon，支持插槽 filterIcon。 -->
    <!-- 3. filterRow={() => null}，则不会显示过滤行 -->
    <!-- <t-table
      rowKey='key'
      :columns="columns"
      :data="data"
      :filter-value.sync="filterValue"
      :filterIcon="filterIcon"
    >
      <template #filterRow>自定义过滤行信息</template>
    </t-table> -->

    <!-- 1. v-model:sync 等同于 filter-value + filter-change -->
    <!-- 2. :filter-row="() => null" 用于隐藏过滤结果行 -->
    <!-- 3. <template #filterRow><p>这是自定义的过滤结果行</p></template> ，可使用插槽完全自定义结果行内容-->
    <t-table
      rowKey="key"
      :columns="columns"
      :data="data"
      :filter-value="filterValue"
      :bordered="bordered"
      resizable
      table-layout="fixed"
      @filter-change="onFilterChange"
      @change="onChange"
    />
  </div>
</template>

<script lang="jsx">
import {
  DateRangePickerPanel,
  // Textarea,
} from 'tdesign-vue';

const data = new Array(5).fill(null).map((_, i) => ({
  key: String(i + 1),
  firstName: ['Eric', 'Gilberta', 'Heriberto', 'Lazarus', 'Zandra'][i % 4],
  lastName: ['Spinke', 'Purves', 'Kment', 'Skures', 'Croson'][i % 4],
  email: [
    'espinke0@apache.org',
    'gpurves1@issuu.com',
    'hkment2@nsw.gov.au',
    'lskures3@apache.org',
    'zcroson5@virginia.edu',
  ][i % 4],
  createTime: ['2021-11-01', '2021-12-01', '2022-01-01', '2022-02-01', '2022-03-01'][i % 4],
}));

export default {
  data() {
    return {
      data,
      filterValue: {},
      bordered: true,
      align: 'left',
    };
  },

  computed: {
    columns() {
      return [
        {
          title: 'FirstName',
          colKey: 'firstName',
          align: this.align,
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
          // 用于查看同时存在排序和过滤时的图标显示是否正常
          sorter: true,
          // 多选过滤配置
          filter: {
            type: 'multiple',
            resetValue: [],
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

            // 如果是文本域搜索，可以使用 Textarea
            // component: Textarea,

            // 按下 Enter 键时也触发确认搜索
            confirmEvents: ['onEnter'],
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
          // 自定义过滤组件：日期过滤配置，请确保自定义组件包含 value 和 onChange 属性
          filter: {
            component: DateRangePickerPanel,
            props: {
              firstDayOfWeek: 7,
            },
            // 是否显示重置取消按钮，一般情况不需要显示
            showConfirmAndReset: true,
            // 日期范围是一个组件，重置时需赋值为 []
            resetValue: [],
          },
        },
      ];
    },
  },

  methods: {
    // filters 参数包含自定义过滤组件 日期选择器 的值
    onFilterChange(filters) {
      console.log('filter-change', filters);
      this.filterValue = filters;
      // 模拟异步请求进行数据过滤
      this.request(this.filterValue);
    },
    // 筛选、分页、排序等功能发生变化时，均会出发 change 事件
    onChange(info, context) {
      console.log('change', info, context, '筛选、分页、排序等功能发生变化均会触发');
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
