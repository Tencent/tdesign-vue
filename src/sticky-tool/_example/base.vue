<template>
  <t-sticky-tool>
    <t-sticky-item label="添加">
      <add-icon slot="icon" />
    </t-sticky-item>
    <t-sticky-item label="搜索" :icon="renderIcon"></t-sticky-item>
  </t-sticky-tool>
</template>

<script lang="jsx">
import { AddIcon, SearchIcon } from 'tdesign-icons-vue';

export default {
  components: {
    AddIcon,
  },
  methods: {
    renderIcon() {
      return <SearchIcon />;
    },
  },
};
</script>
