<template>
  <div class="tdesign-demo-item--datepicker">
    <t-date-picker
      theme="primary"
      mode="date"
      clearable
      :prefixIcon="() => renderPrefixIcon"
    >
      <lock-on-icon slot="suffixIcon"></lock-on-icon>
    </t-date-picker>
  </div>
</template>
<script lang="jsx">
import { BrowseIcon, LockOnIcon } from 'tdesign-icons-vue';

export default {
  components: {
    LockOnIcon,
  },
  methods: {
    renderPrefixIcon() {
      return <BrowseIcon></BrowseIcon>;
    },
  },
};
</script>
