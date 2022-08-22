<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList" :panel-list="panelList" @PanelChange="onPanelChange">
    <template #watermark="{ configProps }">
      <t-watermark
        v-bind="configProps"
        :watermark-content="{
          text: '文字水印',
        }"
        :width="120"
        :height="60"
        :y="200"
        :x="210"
      >
        <div style="height: 200px" />
      </t-watermark>
    </template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { ref, onMounted } from '@vue/composition-api';
import configJson from './props.json';

const configList = ref(configJson);
const panelList = [{ label: 'watermark', value: 'watermark' }];

const usageCodeMap = {
  watermark:
    '\n        <t-watermark\n          v-bind="configProps"\n          :watermark-content="{\n            text: \'文字水印\',\n          }"\n          :width="120"\n          :height="60"\n          :y="200"\n          :x="210"\n        >\n          <div style="height: 200px" />\n        </t-watermark>\n      ',
};
const usageCode = ref(`<template>${usageCodeMap[panelList[0].value].trim()}</template>`);

function onPanelChange(panel) {
  usageCode.value = `<template>${usageCodeMap[panel].trim()}</template>`;
}
</script>
