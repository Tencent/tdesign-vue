<template>
  <t-locale-provider :globalLocale="globalLocale" style="padding: 16px">
    <t-pagination v-model="current" :total="100" show-jumper :maxPageBtn="5"/>
    <br>
    <t-calendar></t-calendar>
    <br>
    <t-transfer :data="transferList" v-model="transferTargetValue" :checked.sync="transferChecked" :search="true" />
    <br><br>
    <div style="width: 480px">
      <t-dialog
        :visible="true"
        header="confirm"
        body="Would you like to be my friends？"
        mode="normal"
        theme="info"
      />
    </div>
    <br><br>
    <t-button theme="primary" @click="openDialog">Open Dialog</t-button>
    <br><br>
    <t-button theme="primary" @click="drawerVisible = true">Open Drawer</t-button>
    <t-drawer :visible.sync="drawerVisible" header="Drawer" :onConfirm="() => drawerVisible = false" :closeBtn="true">
      <p>This is a controlled drawer</p>
    </t-drawer>
    <br><br>
    <t-popconfirm theme="default" content="Do you want to delete">
      <t-button>Popconfirm</t-button>
    </t-popconfirm>
    <br><br>
    <t-table
      :data="[]"
      :columns="columns"
      rowKey="id"
    ></t-table>
    <!-- 数组件空数据 -->
    <t-tree :data="[]"/>
    <!-- 数组件自定义层级图标 -->
    <t-tree :data="treeData" transition/>
    <br><br>
    <t-select
      v-model="selectValue1"
      :options="options1"
      placeholder="single select, see close icon, it is configurable"
      clearable
      style="width: 400px;"
    />
    <br><br>
    <t-select
      v-model="selectValue1"
      :options="options1"
      placeholder="multiple select"
      filterable
      multiple
      style="width: 400px;"
    />
    <br><br>
    <t-select
      v-model="selectValue2"
      placeholder="multiple remote select"
      :options="options2"
      :onSearch="remoteFilterMethod"
      :loading="selectLoading"
      multiple
      filterable
      reserveKeyword
      style="width: 400px;"
    />
    <br><br>
    <t-tree-select
      v-model="treeValue"
      :data="treeOptions"
      filterable
      placeholder="tree select"
      style="width: 400px;"
    />
    <br><br>
    <t-date-picker
      placeholder="please select the date"
      mode="date"
      style="width: 400px;"
    />
    <br><br>
    <t-time-picker
      placeholder="please select the time"
      format="hh:mm:ss a"
    />
    <br><br><br>
    <t-steps :current="2">
      <t-step-item title="已完成的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="已完成的步骤" content="这里是提示文字"></t-step-item>
      <t-step-item title="错误的步骤" status="error" content="自定错误图标"></t-step-item>
      <t-step-item title="未进行的步骤" content="这里是提示文字"></t-step-item>
    </t-steps>
    <br><br>
  </t-locale-provider>
</template>

<script>
import TIconError from '@tencent/tdesign-vue/lib/icon/error';
import TIconCaretRightSmall from '@tencent/tdesign-vue/lib/icon/caret-right-small';
import TIconCloseCircleFilled from '@tencent/tdesign-vue/lib/icon/close-circle-filled';
import TIconChevronDown from '@tencent/tdesign-vue/lib/icon/chevron-down';
import TIconCarretDownSmall from '@tencent/tdesign-vue/lib/icon/caret-down-small';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const GLOBAL_CONFIG = {
  pagination: {
    itemsPerPage: '{size} items per page',
    jumpTo: 'jump to',
    page: '',
    total: 'Total {total}',
  },
  calendar: {
    yearSelection: '{year}',
    // monthSelection: '{month} month',
    monthSelection: ({ month }) => MONTHS[month - 1],
    yearRadio: 'Year',
    monthRadio: 'Month',
    hideWeekend: 'Hide Weekend',
    showWeekend: 'Show Weekend',
    today: 'Today',
    thisMonth: 'This Month',
    week: ['Monday', 'Tuesday', 'Wedsday', 'Thuresday', 'Friday', 'Staturday', 'Sunday'].join(),
    cellMonth: MONTHS.join(),
  },
  transfer: {
    title: '{checked} / {total}',
    empty: 'Empty Data',
    placeholder: 'keyword to search',
  },
  dialog: {
    confirm: 'ok',
    cancel: 'cancel',
  },
  drawer: {
    confirm: 'confirm',
    cancel: 'cancel',
  },
  popconfirm: {
    confirm: 'ok',
    cancel: 'cancel',
  },
  table: {
    empty: 'Table Data is empty.',
    expandIcon: (h) => h && <TIconChevronDown />,
    sortIcon: (h) => h && <TIconCarretDownSmall size='18px' />,
  },
  tree: {
    empty: 'Tree Empty Data',
    folderIcon: (h) => h && <TIconCaretRightSmall size='20px' />,
  },
  select: {
    empty: 'Empty Data',
    loadingText: 'loading...',
    clearIcon: (h) => h && <TIconCloseCircleFilled />,
  },
  treeSelect: {
    empty: 'Empty Data',
    loadingText: 'loading...',
  },
  datePicker: {
    weekdays: {
      shorthand: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    months: {
      shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      longhand: MONTHS.join(),
    },
    rangeSeparator: ' to ',
    direction: 'ltr',
    format: 'YYYYMMDD',
    dayAriaLabel: 'Day',
    weekAbbreviation: 'Wk',
    yearAriaLabel: '',
    applyLabel: 'Apply',
    cancelLabel: 'Cancel',
    weekLabel: 'W',
    clearLabel: 'Clear',
    monthAriaLabel: 'th',
    presets: {
      Today: 'Today',
      'Last 2 days': 'Last 2 days',
      'Last 7 days': 'Last 7 days',
      'Last 14 days': 'Last 14 days',
      'Last 30 days': 'Last 30 days',
      'Next 30 Days': 'Next 30 Days',
      'Month to date': 'Month to date',
    },
  },
  timePicker: {
    nowtime: 'now',
    confirm: 'ok',
    anteMeridiem: 'AM',
    postMeridiem: 'PM',
  },
  steps: {
    errorIcon: (h) => h && <TIconError />,
  },
};

const transferList = [];
for (let i = 0; i < 20; i++) {
  transferList.push({
    value: i.toString(),
    label: `content ${i + 1}`,
    disabled: i % 4 < 1,
  });
}

const SELECET_OPTIONS = [
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shenzhen', value: 'shenzhen' },
];

const TREE_OPTIONS = [
  {
    label: '1',
    value: '1',
    children: [
      { label: '1.1', value: '1.1' },
      { label: '1.2', value: '1.2' },
    ],
  },
  {
    label: '2',
    value: '2',
    children: [
      { label: '2.1', value: '2.1' },
      { label: '2.2', value: '2.2' },
    ],
  },
];

const TREE_DATA = [
  { value: '1', label: '目录图标', children: [{ label: '1.1' }, { label: '1.2' }] },
  { value: '2', label: '可配置', children: [{ label: '2.1' }, { label: '2.2' }] },
];

export default {
  data() {
    return {
      current: 12,
      globalLocale: GLOBAL_CONFIG,
      transferList,
      transferChecked: [],
      transferTargetValue: [],
      drawerVisible: false,
      columns: [
        {
          colKey: 'type',
          title: 'type',
        },
        {
          colKey: 'platform',
          title: 'platform',
        },
        {
          colKey: 'property',
          title: 'property',
        },
      ],
      selectValue1: [],
      selectValue2: [],
      options1: SELECET_OPTIONS.concat(),
      options2: SELECET_OPTIONS.concat(),
      selectLoading: false,
      treeValue: '',
      treeOptions: TREE_OPTIONS,
      treeData: TREE_DATA,
    };
  },
  methods: {
    openDialog() {
      this.$dialog.confirm({
        body: 'This is content',
        cancelBtn: 'cancel',
        confirmBtn: 'confirm',
      });
    },
    remoteFilterMethod(filterWords) {
      this.selectLoading = true;
      const timer = setTimeout(() => {
        this.options2 = filterWords
          ? SELECET_OPTIONS.slice(1, 2)
          : SELECET_OPTIONS.concat();
        this.selectLoading = false;
        clearTimeout(timer);
      }, 100);
    },
  },
};
</script>
<style scoped>
.tdesign-demo-item--locale-provider-base {
  margin: 24px -120px 0 0;
}
</style>
