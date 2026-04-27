<template>
  <t-breadcrumb :separator="() => '/'">
    <t-breadcrumb-item>页面1</t-breadcrumb-item>
    <t-breadcrumb-item>页面2 <chevron-down-icon name="chevron-down" /></t-breadcrumb-item>
    <t-breadcrumb-item>页面3</t-breadcrumb-item>
  </t-breadcrumb>
</template>
<script setup>
import { ChevronDownIcon } from 'tdesign-icons-vue';
</script>
