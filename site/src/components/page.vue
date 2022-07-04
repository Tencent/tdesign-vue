<template>
  <td-doc-layout>
    <td-header ref="tdHeader" slot="header">
      <td-doc-search slot="search" ref="tdDocSearch"></td-doc-search>
    </td-header>
    <td-doc-aside ref="tdDocAside" title="Vue for Web">
      <t-select slot="extra" :value="version" :popupProps="{ zIndex: 800 }" @change="changeVersion">
        <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
          {{ item.label }}
        </t-option>
      </t-select>
    </td-doc-aside>
    <router-view :style="contentStyle" @loaded="contentLoaded" />
  </td-doc-layout>
</template>

<script>
import siteConfig from '../../site.config';
import packageJson from '@/package.json';

const currentVersion = packageJson.version.replace(/\./g, '_');
const { docs, enDocs } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const docsMap = {
  zh: docs,
  en: enDocs,
};

const registryUrl = 'https://mirrors.tencent.com/npm/tdesign-vue';

export default {
  data() {
    return {
      loaded: false,
      version: currentVersion,
      options: [],
    };
  },

  computed: {
    contentStyle() {
      const { loaded } = this;
      return { visibility: loaded ? 'visible' : 'hidden' };
    },
    lang() {
      return this.$route?.meta?.lang || 'zh';
    },
  },

  mounted() {
    this.$refs.tdHeader.framework = 'vue';
    this.$refs.tdDocAside.routerList = docsMap[this.lang];
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
            const nums = v.split('.');
            if ((nums[0] === '0' && nums[1] < 32) || v.indexOf('alpha') > -1 || v.indexOf('patch') > -1) return false;
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
