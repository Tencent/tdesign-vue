<template>
  <t-locale-provider :globalLocale="globalLocale">
    <t-pagination v-model="current" :total="100" show-jumper :maxPageBtn="5"/>
    <br>
    <t-calendar></t-calendar>
    <br>
    <t-transfer :data="transferList" v-model="transferTargetValue" :checked.sync="transferChecked" :search="true" />
    <br><br>
    <div style="width: 480px">
      <t-dialog :visible="true" header="confirm" body="Would you like to be my friends？" mode="normal" theme="info"></t-dialog>
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
    <t-tree :data="[]"/>
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
  </t-locale-provider>
</template>

<script>
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
  tree: {
    empty: 'Empty Data',
  },
  select: {
    empty: 'Empty Data',
    loadingText: 'loading...',
  },
  treeSelect: {
    empty: 'Empty Data',
    loadingText: 'loading...',
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

export default {
  data() {
    return {
      current: 12,
      globalLocale: GLOBAL_CONFIG,
      transferList,
      transferChecked: [],
      transferTargetValue: [],
      drawerVisible: false,
      selectValue1: [],
      selectValue2: [],
      options1: SELECET_OPTIONS.concat(),
      options2: SELECET_OPTIONS.concat(),
      selectLoading: false,
      treeValue: '',
      treeOptions: TREE_OPTIONS,
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
<style>
.tdesign-demo-item--locale-provider-base {
  margin: 24px -120px 0 0;
}
</style>
