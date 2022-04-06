<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList">
    <template #default="{ configProps }">
      <div :style="{ width: '200px' }">
        <span>正直</span>
        <t-divider v-bind="configProps">TDesign</t-divider>
        <span>进取</span>
        <t-divider v-bind="configProps">TDesign</t-divider>
        <span>合作</span>
        <t-divider v-bind="configProps">TDesign</t-divider>
        <span>创新</span>
      </div>
    </template>
  </base-usage>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import BaseUsage from '@site/src/components/base-usage.vue';
import configList from './props.json';
import { Divider as TDivider } from 'tdesign-vue';
const components = { TDivider };

export default Vue.extend({
  components: {
    BaseUsage,
    ...components,
  },
  data() {
    return {
      configList,
      usageCode: `<t-divider v-bind="configProps">TDesign</t-divider>
`,
    };
  },
});
</script>
