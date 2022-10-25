<template>
  <t-input v-model="input" :maxlength="5" :suffix="suffix" style="max-width: 500px" />
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
      return `${[...this.input].length}/5`;
    },
  },
};
</script>
