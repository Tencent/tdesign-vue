<template>
  <div class="tdesign-demo-block-column" style="width: 80%">
    <t-tag-input v-model="tags1" size="small" clearable />

    <t-tag-input v-model="tags2" clearable />

    <t-tag-input v-model="tags3" size="large" clearable />
  </div>
</template>
<script>
export default {
  data() {
    return {
      tags1: ['Vue', 'React'],
      tags2: ['Vue', 'React'],
      tags3: ['Vue', 'React'],
    };
  },
};
</script>
