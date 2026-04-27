<template>
  <div style="width: 100%">
    <t-typography-text copyable>This is a copyable text.</t-typography-text>
    <br />
    <t-typography-text
      :copyable="{
        tooltipProps: {
          content: 'click to copy the text',
        },
      }"
    >This is a copyable text.</t-typography-text
    >
    <br />
    <t-typography-text :copyable="copyableConfig">This is a copyable text.</t-typography-text>
  </div>
</template>

<script lang="tsx">
import Vue from 'vue';
import { SmileIcon } from 'tdesign-icons-vue';

export default Vue.extend({
  data() {
    return {
      copyableConfig: {
        suffix: () => <SmileIcon />,
        tooltipProps: {
          content: 'click to copy the text',
        },
      },
    };
  },
});
</script>
