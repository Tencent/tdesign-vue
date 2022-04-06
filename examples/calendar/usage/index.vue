<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList">
    <template #default="{ configProps }">
      <t-calendar v-bind="configProps" />
    </template>
  </base-usage>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import BaseUsage from '@site/src/components/base-usage.vue';
import configList from './props.json';
import { Calendar as TCalendar } from 'tdesign-vue';
const components = { TCalendar };

export default Vue.extend({
  components: {
    BaseUsage,
    ...components,
  },
  data() {
    return {
      configList,
      usageCode: `<t-calendar v-bind="configProps" />
`,
    };
  },
});
</script>
