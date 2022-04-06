<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList">
    <template #default="{ configProps }">
      <t-date-picker v-bind="configProps" />
    </template>
  </base-usage>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import BaseUsage from '@site/src/components/base-usage.vue';
import configList from './props.json';
import { DatePicker as TDatePicker } from 'tdesign-vue';
const components = { TDatePicker };

export default Vue.extend({
  components: {
    BaseUsage,
    ...components,
  },
  data() {
    return {
      configList,
      usageCode: `<t-date-picker v-bind="configProps" />
`,
    };
  },
});
</script>
