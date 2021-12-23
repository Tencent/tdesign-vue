<template>
  <t-config-provider :globalConfig="globalConfig" style="padding: 16px">
    <t-pagination v-model="current" :total="36" show-jumper :maxPageBtn="5" />
  </t-config-provider>
</template>

<script>
export default {
  data() {
    return {
      current: 1,
      globalConfig: {
        pagination: {
          itemsPerPage: '{size} / page',
          jumpTo: 'jump to',
          page: '',
          total: 'Total {total} items',
        },
      },
    };
  },
};
</script>

<style scoped>
.tdesign-demo-item--locale-provider-base {
  margin: 24px -120px 0 0;
}
</style>
