<template>
  <t-range-input-popup :panel="panel" />
</template>

<script setup lang="jsx">
import { ref } from 'vue';

const panel = ref(() => <div>hello world</div>);
</script>
