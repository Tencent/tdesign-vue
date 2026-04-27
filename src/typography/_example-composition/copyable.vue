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

<script lang="jsx" setup>
import { SmileIcon } from 'tdesign-icons-vue';

const copyableConfig = {
  suffix: () => <SmileIcon />,
  tooltipProps: {
    content: 'click to copy the text',
  },
};
</script>
