<template>
  <t-breadcrumb>
    <template v-slot:default>
      <t-breadcrumbItem>页面1</t-breadcrumbItem>
      <t-breadcrumbItem>页面2</t-breadcrumbItem>
      <t-breadcrumbItem>页面3</t-breadcrumbItem>
    </template>
    <template v-slot:separator> <chevron-right-icon name="chevron-right" /> </template>
  </t-breadcrumb>
</template>
<script>
import { ChevronRightIcon } from 'tdesign-icons-vue';

export default {
  components: {
    ChevronRightIcon,
  },
};
</script>
