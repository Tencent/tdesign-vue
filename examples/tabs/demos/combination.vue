<template>
  <div class="tdesign-demo-block-column-large" style="width: 100%">
    <div>
      <t-radio-group variant="default-filled" v-model="theme">
        <t-radio-button value="normal">常规型</t-radio-button>
        <t-radio-button value="card">卡片型</t-radio-button>
      </t-radio-group>
    </div>
    <t-tabs
      v-model="value"
      :theme="theme"
    >
      <t-tab-panel v-for="(item, index) in 20" :key="index" :value="index + ''" :label="`选项卡${index + 1}`">
        <p style="padding: 25px;">选项卡{{index + 1}}</p>
      </t-tab-panel>
    </t-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'normal',
      value: '1',
    };
  },
};
</script>
