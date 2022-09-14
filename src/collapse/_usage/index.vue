<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList" :panel-list="panelList" @PanelChange="onPanelChange">
    <template #collapse="{ configProps }">
      <t-collapse v-bind="configProps">
        <t-collapse-panel header="这是一个折叠标题">
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </t-collapse-panel>
        <t-collapse-panel header="这是一个折叠标题">
          这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
        </t-collapse-panel>
      </t-collapse>
    </template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { ref, onMounted } from '@vue/composition-api';
import configJson from './props.json';

const configList = ref(configJson);
const panelList = [{ label: 'collapse', value: 'collapse' }];

const usageCodeMap = {
  collapse:
    '\n        <t-collapse v-bind="configProps">\n          <t-collapse-panel header="这是一个折叠标题">\n            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。\n          </t-collapse-panel>\n          <t-collapse-panel header="这是一个折叠标题">\n            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。\n          </t-collapse-panel>\n        </t-collapse>\n      ',
};
const usageCode = ref(`<template>${usageCodeMap[panelList[0].value].trim()}</template>`);

function onPanelChange(panel) {
  usageCode.value = `<template>${usageCodeMap[panel].trim()}</template>`;
}
</script>
