<template>
  <t-space>
    <t-switch v-model="checked" shape="circle"></t-switch>
    <t-switch v-model="checked" shape="round"></t-switch>
    <t-switch v-model="checked" shape="line"></t-switch>
  </t-space>
</template>

<script lang="ts" setup>
import { ref } from '@vue/composition-api';

const checked = ref(true);
</script>
