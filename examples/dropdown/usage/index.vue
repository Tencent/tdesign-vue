<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList">
    <template #default="{ configProps }">
      <t-dropdown
        :options="[
          { content: '操作一', value: 1 },
          { content: '操作二', value: 2 },
        ]"
        v-bind="configProps"
      >
        <t-button>更多...</t-button>
      </t-dropdown>
    </template>
  </base-usage>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import BaseUsage from '@site/src/components/base-usage.vue';
import configList from './props.json';

import { Dropdown as TDropdown, Button as TButton } from 'tdesign-vue';
const components = { TDropdown, TButton };

export default Vue.extend({
  components: {
    BaseUsage,
    ...components,
  },
  data() {
    return {
      configList,
      usageCode: `<t-dropdown
  :options="[{ content: '操作一', value: 1 }, { content: '操作二', value: 2 }]"
  v-bind="configProps"
>
  <t-button>更多...</t-button>
</t-dropdown>
`,
    };
  },
});
</script>
