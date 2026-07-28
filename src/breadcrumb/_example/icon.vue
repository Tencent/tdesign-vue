<template>
  <t-breadcrumb>
    <t-breadcrumb-item><bookmark-icon name="bookmark" slot="icon" />页面1</t-breadcrumb-item>
    <t-breadcrumb-item><bookmark-icon name="bookmark" slot="icon" />页面2</t-breadcrumb-item>
    <t-breadcrumb-item><bookmark-icon name="bookmark" slot="icon" />页面3</t-breadcrumb-item>
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
