<template>
  <t-card bordered :title="title" :loading="isLoading" :style="{ width: '400px' }" :loading-props="customProps">
    {{ infoMessage }}
  </t-card>
</template>

<script>
export default {
  data() {
    return {
      title: '自定义loadingProps Card',
      isLoading: true,
      customProps: {
        text: 'TDesign努力加载中...',
      },
      infoMessage: '',
    };
  },
};
</script>
