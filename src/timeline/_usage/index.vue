<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList" :panel-list="panelList" @PanelChange="onPanelChange">
    <template #timeline="{ configProps }">
      <t-timeline v-bind="configProps">
        <t-timeline-item label="2022-01-01">事件一</t-timeline-item>
        <t-timeline-item label="2022-02-01">事件二</t-timeline-item>
        <t-timeline-item label="2022-03-01">事件三</t-timeline-item>
      </t-timeline>
    </template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { ref, onMounted } from '@vue/composition-api';
import configJson from './props.json';

const configList = ref(configJson);
const panelList = [{ label: 'timeline', value: 'timeline' }];

const usageCodeMap = {
  timeline:
    '<t-timeline v-bind="configProps">\n              <t-timeline-item label="2022-01-01">事件一</t-timeline-item>\n              <t-timeline-item label="2022-02-01">事件二</t-timeline-item>\n              <t-timeline-item label="2022-03-01">事件三</t-timeline-item>\n      </t-timeline>',
};
const usageCode = ref(`<template>${usageCodeMap[panelList[0].value].trim()}</template>`);

function onPanelChange(panel) {
  usageCode.value = `<template>${usageCodeMap[panel].trim()}</template>`;
}
</script>
