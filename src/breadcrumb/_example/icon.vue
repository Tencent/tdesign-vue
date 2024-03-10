<template>
  <t-breadcrumb>
    <t-breadcrumbItem><bookmark-icon name="bookmark" slot="icon" />页面1</t-breadcrumbItem>
    <t-breadcrumbItem><bookmark-icon name="bookmark" slot="icon" />页面2</t-breadcrumbItem>
    <t-breadcrumbItem><bookmark-icon name="bookmark" slot="icon" />页面3</t-breadcrumbItem>
  </t-breadcrumb>
</template>
<script>
import { BookmarkIcon } from 'tdesign-icons-vue';

export default {
  components: {
    BookmarkIcon,
  },
};
</script>
