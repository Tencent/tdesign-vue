<template>
  <t-time-picker v-model="value" format="hh:mm:ss a" :hideDisabledTime="false" />
</template>

<script setup>
import { ref } from 'vue';

const value = ref('10:20:30 am');
</script>
