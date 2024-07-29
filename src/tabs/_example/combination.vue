<template>
  <t-space direction="vertical" style="width: 100%" size="32px">
    <t-radio-group variant="default-filled" v-model="theme">
      <t-radio-button value="normal">常规型</t-radio-button>
      <t-radio-button value="card">卡片型</t-radio-button>
    </t-radio-group>
    <t-radio-group variant="default-filled" v-model="scrollPosition">
      <t-radio-button value="auto">Auto</t-radio-button>
      <t-radio-button value="start">Start</t-radio-button>
      <t-radio-button value="center">Center</t-radio-button>
      <t-radio-button value="end">End</t-radio-button>
    </t-radio-group>
    <t-tabs v-model="value" :theme="theme" :scrollPosition="scrollPosition">
      <t-tab-panel v-for="(item, index) in 30" :key="index" :value="index + ''" :label="`选项卡${index + 1}`">
        <p style="padding: 25px">选项卡{{ index + 1 }}</p>
      </t-tab-panel>
    </t-tabs>
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      theme: 'normal',
      value: '21',
      scrollPosition: 'auto',
    };
  },
};
</script>
