<template>
  <t-sticky-tool width="40px">
    <t-sticky-item label="已完成的步骤">
      <add-icon slot="icon" />
    </t-sticky-item>
    <t-sticky-item label="进行中的步骤" :icon="renderIcon"></t-sticky-item>
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
