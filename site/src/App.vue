<template>
  <t-config-provider :global-config="globalConfig">
    <router-view />
    <td-theme-generator />
  </t-config-provider>
</template>

<script>
import enConfig from 'tdesign-vue/es/locale/en_US';
import zhConfig from 'tdesign-vue/es/locale/zh_CN';
import { getLang } from 'tdesign-site-components';

export default {
  data() {
    return {
      lang: getLang(),
    };
  },
  computed: {
    globalConfig() {
      return this.lang === 'en' ? enConfig : zhConfig;
    },
  },
};
</script>

<style lang="less">
div[slot='action'] {
  display: inline-flex;
  column-gap: 8px;
}

.action-online {
  width: 32px;
  height: 32px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: all 0.2s linear;
  cursor: pointer;
  border-radius: 3px;
  color: var(--text-secondary);

  &:hover {
    color: var(--text-primary);
    background-color: var(--bg-color-demo-hover, rgb(243, 243, 243));
  }
}
</style>
