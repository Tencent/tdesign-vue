<template>
  <t-jumper layout="vertical" @change="handleChange" />
</template>

<script>
export default {
  methods: {
    handleChange(ctx) {
      console.log('ctx', ctx);
    },
  },
};
</script>
