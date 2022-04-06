const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const config = require('./config.js');

const renderUsageStr = (compStrMap) => `<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage.js 中调整 -->
<template>
  <base-usage :code="usageCode" :config-list="configList">
    <template #default="{ configProps }">
      ${compStrMap.renderStr}
    </template>
  </base-usage>
</template>

<script>
/* eslint-disable */
import Vue from 'vue';
import BaseUsage from '@site/src/components/base-usage.vue';
${compStrMap.configStr}
${compStrMap.importStr}

export default Vue.extend({
  components: {
    BaseUsage,
    ...components,
  },
  data() {
    return {
      configList,
      usageCode: \`${codeFormat(compStrMap.usageStr || compStrMap.renderStr, {
    parser: 'html',
    singleAttributePerLine: true,
  })}\`,
    };
  },
});
</script>
`;

// 自动化生成 live demo 脚本
function genUsage() {
  // eslint-disable-next-line no-restricted-syntax
  for (const name of Object.keys(config)) {
    try {
      const fileFolderPath = path.resolve(__dirname, `../../examples/${name}/usage`);
      fs.mkdirSync(fileFolderPath);
    } catch (e) { /* empty */ }

    try {
      const data = renderUsageStr(config[name]);
      const filePath = path.resolve(__dirname, `../../examples/${name}/usage/index.vue`);
      fs.writeFileSync(filePath, codeFormat(data));
    } catch (err) {
      console.error(`${name} usage 组件生成失败...`, err);
    }
    console.log(`${name} usage 组件生成成功...`);
  }
}

// 格式化vue代码
function codeFormat(code, options = {}) {
  return prettier.format(code, {
    ...require('../../.prettierrc.js'),
    parser: 'vue',
    ...options,
  });
}

genUsage();
