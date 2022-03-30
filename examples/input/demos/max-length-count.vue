<template>
  <div class="tdesign-demo-block-column" style="max-width: 500px">
    <t-input v-model="input" :maxlength="5" :suffix="suffix" />
  </div>
</template>
<script>
export default {
  data() {
    return {
      input: '',
    };
  },
  computed: {
    suffix() {
      return `${this.input.length}/5`;
    },
  },
};
</script>
