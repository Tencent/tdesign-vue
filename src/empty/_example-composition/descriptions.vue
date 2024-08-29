<template>
  <t-empty :description="description" :title="title"> </t-empty>
</template>
<script setup>
import { ref } from 'vue';

const title = ref('Empty');
const description = ref('Description');
</script>
