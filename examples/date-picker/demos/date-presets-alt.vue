<template>
  <div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker v-model="selectedDates" v-bind:presets="presetsRange" theme="primary" mode="date" range>
        <template v-slot:default="{ trigger }">
          <t-button
            v-for="(value, key) in presetsRange"
            v-bind:key="key"
            theme="primary"
            variant="text"
            v-on:click="trigger('click', value, true)"
          >
            {{ key }}
          </t-button>
        </template>
      </t-date-picker>
    </div>
    <div class="tdesign-demo-item--datepicker">
      <t-date-picker v-model="selectedDate" v-bind:presets="presets" theme="primary" mode="date">
        <template v-slot:default="{ trigger }">
          <t-button
            v-for="(value, key) in presets"
            v-bind:key="key"
            theme="primary"
            variant="text"
            v-on:click="trigger('click', value, true)"
          >
            {{ key }}
          </t-button>
        </template>
      </t-date-picker>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';

export default {
  data() {
    return {
      presetsRange: {
        最近7天: [dayjs().subtract(6, 'day'), dayjs()],
        最近3天: [dayjs().subtract(2, 'day'), dayjs()],
        今天: [dayjs()],
      },
      presets: {
        '7天前': dayjs().subtract(6, 'day'),
        今天: dayjs(),
      },
      dateText: '日期',
      selectedDates: [dayjs().toISOString(), dayjs().toISOString()],
      selectedDate: dayjs().toISOString(),
    };
  },
};
</script>
<style scoped>
.tdesign-demo-item--datepicker {
  margin-bottom: 12px;
}
</style>
