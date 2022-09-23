<template>
  <div class="tag-demo">
    <t-tag v-for="color in colors" :key="color" :color="color" closable>{{ color }}</t-tag>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colors: [
        '#0099FF',
        '#336666',
        '#6666FF',
        '#9966FF',
        '#FF9900',
        '#FF9999',
        '#FF6666',
        '#009999',
        '#CC6666',
        '#CC6633',
        '#333333',
        '#666699',
        '#999999',
      ],
    };
  },
};
</script>

<style lang="less" scoped>
.tag-demo {
  > * {
    margin-right: 6px;
    margin-bottom: 6px;
  }
}
</style>
