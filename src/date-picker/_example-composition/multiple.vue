<template>
  <t-space direction="vertical">
    <t-date-picker v-model="date" placeholder="支持日期的多选" clearable multiple @change="handleChange" />
    <t-date-picker v-model="week" mode="week" placeholder="支持周的多选" clearable multiple @change="handleChange" />
    <t-date-picker
      v-model="quarter"
      mode="quarter"
      placeholder="支持季度的多选"
      clearable
      multiple
      @change="handleChange"
    />
  </t-space>
</template>

<script setup>
import { ref } from 'vue';

const date = ref(['2000-01-04', '2000-01-03', '2000-01-05']);
const week = ref([]);
const quarter = ref([]);
const handleChange = (value, context) => {
  console.log('onChange:', value, context);
};
</script>
