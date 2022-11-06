<template>
  <t-space direction="vertical">
    <t-auto-complete v-model="value1" size="small" :options="['第一个联想词', '第二个联想词', '第三个联想词']" />
    <t-auto-complete v-model="value2" :options="['第一个联想词', '第二个联想词', '第三个联想词']" />
    <t-auto-complete v-model="value3" size="large" :options="['第一个联想词', '第二个联想词', '第三个联想词']" />
  </t-space>
</template>

<script>
export default {
  name: 'AutoCompleteBase',

  data() {
    return {
      value1: '',
      value2: '',
      value3: '',
    };
  },
};
</script>
