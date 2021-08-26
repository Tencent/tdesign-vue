<template>
  <div class="t-demo-tabs">
    <div class="t-demo-tabs__desc">
      <t-radio-group v-model="theme">
        <t-radio value="normal">常规型</t-radio>
        <t-radio value="card">卡片型</t-radio>
      </t-radio-group>
    </div>
    <t-tabs
      :value="value"
      :theme="theme"
      @change="(newValue) => value = newValue"
    >
      <t-tab-panel value="first">
        <template #label>
          <t-icon name="home" style="margin-right: 4px"/> 首页
        </template>
        <p style="padding: 25px;">{{ `${theme}选项卡1内容` }}</p>
      </t-tab-panel>
      <t-tab-panel value="second" :label="() => `${theme}选项卡22`">
        <template #label>
          <t-icon name="calendar" style="margin-right: 4px"/> 日程
        </template>
        <p style="padding: 25px;">{{ `${theme}选项卡2内容` }}</p>
      </t-tab-panel>
      <t-tab-panel value="third" :label="`${theme}选项卡3`">
        <template #label>
          <t-icon name="layers" style="margin-right: 4px"/> 事项
        </template>
        <p style="padding: 25px;">{{ `${theme}选项卡3内容` }}</p>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<style lang="less" scoped>
  .t-demo-tabs {

    &__desc {
      margin-bottom: 20px;
      color: #333;
      font-size: 14px;

      &:not(:first-of-type) {
        margin-top: 20px;
      }

      p {
        margin-bottom: 20px;
      }
    }
  }
</style>

<script>
export default {
  data() {
    return {
      theme: 'normal',
      value: 'first',
    };
  },
};
</script>
