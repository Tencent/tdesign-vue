<template>
  <t-empty :description="description" :title="title"> </t-empty>
</template>
<script>
export default {
  data() {
    return {
      title: 'Empty',
      description: 'Description',
    };
  },
  methods: {
    goToIndex() {
      console.log('go to index');
      location.href = '/';
    },
  },
};
</script>
