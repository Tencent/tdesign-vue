<template>
  <td-doc-layout>
    <td-header ref="tdHeader" slot="header">
      <td-doc-search slot="search" ref="tdDocSearch"></td-doc-search>
    </td-header>
    <td-doc-aside ref="tdDocAside" title="Vue for Web">
      <t-select
        slot="extra"
        id="historyVersion"
        v-model="version"
        :popupProps="{ zIndex: 500, attach: getAttach }"
        @change="changeVersion"
      >
        <t-option v-for="(item, index) in options" :value="item.value" :label="item.label" :key="index">
          {{ item.label }}
        </t-option>
      </t-select>
    </td-doc-aside>

    <router-view :style="contentStyle" @loaded="contentLoaded" :docType="docType" />
  </td-doc-layout>
</template>

<script lang="jsx">
import siteConfig from '../../site.config.js';
import packageJson from '@/package.json';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

const { docs: routerList } = JSON.parse(JSON.stringify(siteConfig).replace(/component:.+/g, ''));

const historyVersion = ['0.28.2', '0.27.2', '0.26.0', '0.22.8'];

export default {
  data() {
    return {
      docType: '',
      loaded: false,
      version: packageJson.version,
      options: [
        { value: packageJson.version, label: packageJson.version },
        ...historyVersion.map((v) => ({ value: v, label: v })),
      ],
    };
  },

  computed: {
    contentStyle() {
      const { loaded } = this;
      return { visibility: loaded ? 'visible' : 'hidden' };
    },
  },

  watch: {
    $route(route) {
      if (!route.meta.docType) return;
      this.docType = route.meta.docType;
    },
  },

  mounted() {
    document.querySelector('td-doc-header').docType = this.$route.meta.docType;

    this.$refs.tdHeader.framework = 'vue';
    this.$refs.tdDocAside.routerList = routerList;
    this.$refs.tdDocAside.onchange = ({ detail }) => {
      if (this.$route.path === detail) return;
      this.loaded = false;
      this.$router.push(detail);
      window.scrollTo(0, 0);
    };
    this.$refs.tdDocSearch.docsearchInfo = { indexName: 'tdesign_doc_vue' };
  },

  methods: {
    getAttach() {
      return document.querySelector('#historyVersion');
    },
    contentLoaded(callback) {
      requestAnimationFrame(() => {
        this.loaded = true;
        callback();
      });
    },
    changeVersion(version) {
      if (version === packageJson.version) return;
      location.href = `https://tdesign.cdn-go.cn/tdesign-vue/${version}/`;
    },
  },
};
</script>
