<template>
  <div>
    <t-pagination
      v-model="index"
      disabled
      :total="100"
      :page-size="5"
    />
  </div>
</template>
<script>
export default {
  data() {
    return {
      index: 1,
    };
  },
};
</script>
