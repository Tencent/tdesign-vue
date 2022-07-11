<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList" :panel-list="panelList" @PanelChange="onPanelChange">
    <template #baseTable="{ configProps }">
      <t-table
        v-bind="configProps"
        row-key="index"
        :maxHeight="140"
        :pagination="{ total: 30 }"
        :data="data"
        :columns="columns"
      />
    </template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { ref, onMounted } from '@vue/composition-api';
import baseConfigJson from './base-table-props.json';
const data = ref(
  Array(30)
    .fill(0)
    .map((_, i) => ({
      index: i,
      platform: '公有',
      description: '数据源',
    })),
);
const columns = ref([
  { colKey: 'index', title: 'index' },
  { colKey: 'platform', title: '平台' },
  { colKey: 'description', title: '说明' },
]);

const configList = ref(baseConfigJson);
const panelList = [{ label: 'baseTable', value: 'baseTable', config: baseConfigJson }];

const usageCodeMap = {
  baseTable:
    '<t-table\n        v-bind="configProps"\n        row-key="index"\n        :maxHeight="140"\n        :pagination="{ total: 30 }"\n        :data="data"\n        :columns="columns"\n      />',
};
const usageCode = ref(`<template>${usageCodeMap[panelList[0].value].trim()}</template>`);

function onPanelChange(panel) {
  configList.value = panelList.find((item) => item.value === panel).config;
  usageCode.value = `<template>${usageCodeMap[panel].trim()}</template>`;
}
</script>
