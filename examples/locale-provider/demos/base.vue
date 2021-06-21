<template>
  <t-locale-provider :globalLocale="globalLocale">
    <t-pagination v-model="current" :total="100" show-jumper :maxPageBtn="5"/>
    <br>
    <t-calendar></t-calendar>
    <br>
    <t-transfer :data="transferList" v-model="transferTargetValue" :checked.sync="transferChecked"/>
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
  </t-locale-provider>
</template>

<script>
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const GLOBAL_CONFIG = {
  pagination: {
    itemsPerPage: '{itemsPerPage} items per page',
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
  },
  dialog: {
    confirm: 'ok',
    cancel: 'cancel',
  },
  drawer: {
    confirm: 'confirm',
    cancel: 'cancel',
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

export default {
  data() {
    return {
      current: 12,
      globalLocale: GLOBAL_CONFIG,
      transferList,
      transferChecked: [],
      transferTargetValue: [],
      drawerVisible: false,
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
  },
};
</script>
<style>
.tdesign-demo-item--locale-provider-base {
  margin: 24px -120px 0 0;
}
</style>
