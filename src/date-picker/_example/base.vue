<template>
  <t-space direction="vertical">
    <h3>valueType:</h3>
    <t-radio-group v-model="valueType" variant="default-filled">
      <t-radio-button value="YYYY-MM-DD">YYYY-MM-DD</t-radio-button>
      <t-radio-button value="time-stamp">time-stamp</t-radio-button>
    </t-radio-group>

    <t-date-picker v-model="date2" :value-type="valueType" @change="handleChange" />
    <t-date-picker
      v-model="date"
      placeholder="可清除、可输入的日期选择器"
      :value-type="valueType"
      clearable
      allow-input
      @change="handleChange"
    />
  </t-space>
</template>

<script>
export default {
  data() {
    return {
      date: '',
      date2: '',
      valueType: 'YYYY-MM-DD',
    };
  },
  methods: {
    handleChange(v) {
      console.log('value:', v);
    },
  },
};
</script>
