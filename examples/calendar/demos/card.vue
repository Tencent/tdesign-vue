<template>
  <div class="tdesign-demo-block-column-large">
    <div>
      <label>请选择风格：</label>
      <t-select v-model="theme" class="demo-select-base">
        <t-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
      </t-select>
      <t-button theme="primary" @click="toCurrent()">今天（当前高亮日期）</t-button>
    </div>
    <div>
      <label>日期补零：</label>
      <t-switch size="large" v-model="fillWithZero"></t-switch>
    </div>
    <t-calendar
      ref="myCalendar"
      :theme="theme"
      :isShowWeekendDefault="isShowWeekendDefault"
      :fillWithZero="fillWithZero"></t-calendar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      theme: 'card',
      isShowWeekendDefault: true,
      fillWithZero: true,
      options: [
        { value: 'full', label: '全屏风格' },
        { value: 'card', label: '卡片风格' },
      ],
    };
  },
  methods: {
    toCurrent() {
      if (this.$refs.myCalendar) {
        this.$refs.myCalendar.toCurrent();
      }
    },
  },
};
</script>

<style scoped>
.demo-select-base {
  width: 200px;
  display: inline-block;
  margin: 0 10px 0 0;
}
</style>
