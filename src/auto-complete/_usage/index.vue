<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList" :panel-list="panelList" @PanelChange="onPanelChange">
    <template #AutoComplete="{ configProps }">
      <t-auto-complete v-bind="configProps" :options="['第一个联想词', '第二个联想词', '第三个联想词']" />
    </template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { ref, onMounted } from '@vue/composition-api';
import configJson from './props.json';

const configList = ref(configJson);
const panelList = [{ label: 'AutoComplete', value: 'AutoComplete' }];

const usageCodeMap = {
  AutoComplete:
    "<t-auto-complete v-bind=\"configProps\" :options=\"['第一个联想词', '第二个联想词', '第三个联想词']\" />",
};
const usageCode = ref(`<template>${usageCodeMap[panelList[0].value].trim()}</template>`);

function onPanelChange(panel) {
  usageCode.value = `<template>${usageCodeMap[panel].trim()}</template>`;
}
</script>
