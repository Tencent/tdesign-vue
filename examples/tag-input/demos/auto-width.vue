<template>
  <div class="tdesign-demo-block-column" style="width: 80%">
    <t-tag-input v-model="tags" auto-width clearable />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags: ['Vue', 'React'],
    };
  },
};
</script>
