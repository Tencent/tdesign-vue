<template>
  <td-doc-layout>
    <td-header ref="tdHeader" slot="header">
      <td-doc-search slot="search" ref="tdDocSearch"></td-doc-search>
    </td-header>
    <td-doc-aside ref="tdDocAside" title="Vue for Web">
      <t-select slot="extra" v-model="version" :popupProps="{ zIndex: 500 }" @change="changeVersion">
        <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
          {{ item.label }}
        </t-option>
      </t-select>
    </td-doc-aside>

    <router-view :style="contentStyle" @loaded="contentLoaded" />
  </td-doc-layout>
</template>

<script>
import siteConfig from '../../site.config.js';
import packageJson from '@/package.json';

const currentVersion = packageJson.version.replace(/\./g, '_');
const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const registryUrl = 'https://mirrors.tencent.com/npm/tdesign-vue';

// 过滤小版本号
export function filterVersions(versions = [], deep = 1) {
  const versionMap = {};

  versions.forEach((v) => {
    const nums = v.split('.');
    versionMap[nums[deep]] = v;
  });

  return Object.values(versionMap);
}

export default {
  data() {
    return {
      loaded: false,
      version: currentVersion,
      options: [{ value: packageJson.version.replace(/\./g, '_'), label: packageJson.version }],
    };
  },

  computed: {
    contentStyle() {
      const { loaded } = this;
      return { visibility: loaded ? 'visible' : 'hidden' };
    },
  },

  mounted() {
    this.$refs.tdHeader.framework = 'vue';
    this.$refs.tdDocAside.routerList = routerList;
    this.$refs.tdDocAside.onchange = ({ detail }) => {
      if (this.$route.path === detail) return;
      this.loaded = false;
      this.$router.push(detail);
      window.scrollTo(0, 0);
    };
    this.$refs.tdDocSearch.docsearchInfo = { indexName: 'tdesign_doc_vue' };
    this.initHistoryVersions();
  },

  methods: {
    initHistoryVersions() {
      fetch(registryUrl)
        .then((res) => res.json())
        .then((res) => {
          const options = [];
          Object.keys(res.versions).forEach((v) => {
            if (v === packageJson.version) return false;
            const nums = v.split('.');
            if ((nums[0] === '0' && nums[1] < 32) || v.indexOf('alpha') > -1) return false;
            options.unshift({ label: v, value: v.replace(/\./g, '_') });
          });
          this.options.push(...options);
        });
    },
    contentLoaded(callback) {
      requestAnimationFrame(() => {
        this.loaded = true;
        callback();
      });
    },
    changeVersion(version) {
      if (version === currentVersion) return;
      const historyUrl = `//${version}-tdesign-vue.surge.sh`;
      window.open(historyUrl, '_blank');
    },
  },
};
</script>
