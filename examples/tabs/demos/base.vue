<template>
  <div class="t-demo-tabs">
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
  </div>
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

<style lang="less" scoped>
  .t-demo-tabs {

    &__desc {
      margin-bottom: 20px;
      color: #333;
      font-size: 14px;

      &:not(:first-of-type) {
        margin-top: 20px;
      }
    }
  }
</style>
