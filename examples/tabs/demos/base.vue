<template>
  <t-tabs v-model="value">
    <!-- 默认插槽 和 具名插槽（panel）都是用来渲染面板内容 -->
    <t-tab-panel value="first" label="选项卡1">
      <p style="padding: 25px;">选项卡一</p>
    </t-tab-panel>
    <t-tab-panel value="second" label="选项卡2">
      <p slot="panel" style="padding: 25px;">选项卡二</p>
    </t-tab-panel>
    <t-tab-panel value="third" label="选项卡3" :panel="panelRender" />
  </t-tabs>
</template>

<script>
export default {
  data() {
    return {
      value: 'first',
    };
  },
  methods: {
    panelRender() {
      return <p style="padding: 25px;">选项卡三</p>;
    },
  },
};
</script>
